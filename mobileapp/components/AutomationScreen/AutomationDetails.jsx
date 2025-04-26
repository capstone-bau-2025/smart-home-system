import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// shows the details of the automation when the user clicks on it
export default function AutomationDetails({
  currentAutomation,
  edit,
  name,
  setName,
  description,
  setDescription,
  type,
  setType,
  action,
  setAction,
  setModalVisible,
  navigation
}) {
  const iconName = {
    schedule: "alarm-sharp",
    device_trigger: "eye-sharp",
    device_status_change: "bulb-sharp",
  };

  const iconGradients = {
    schedule: ["#14f423", "#9fc464"],
    device_trigger: ["#56CCF2", "#2F80ED"],
    device_status_change: ["#6a11cb", "#2575fc"],
  };

  return (
    <>
      {edit && (
        <>
          <Text style={styles.infoText}>Name</Text>
          <View style={styles.propContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter Automation Name"
              placeholderTextColor="#999"
              multiline
            />
          </View>
        </>
      )}

      <Text style={styles.infoText}>Description</Text>
      <View style={styles.propContainer}>
        {edit ? (
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#999"
            multiline
          />
        ) : (
          <Text style={styles.propText}>{currentAutomation.description || "No details available."}</Text>
        )}
      </View>

      <Text style={styles.infoText}>Type</Text>
      <View style={styles.propContainerRow}>
        <LinearGradient
          colors={iconGradients[currentAutomation.type] || ["#ddd", "#bbb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIcon}
        >
          <Ionicons name={iconName[currentAutomation.type] || "help-circle-outline"} size={24} color="white" />
        </LinearGradient>
        {edit ? (
          <TouchableOpacity
            style={styles.touchableField}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.propText}>{type || "Select type"}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#666" style={styles.editIcon} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.propText}>{currentAutomation.type || "No details available."}</Text>
        )}
      </View>

      <Text style={styles.infoText}>Action</Text>
      <View style={styles.propContainerRow}>
        <LinearGradient
          colors={["#757af5", "#244ced"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIcon}
        >
          <Ionicons name={"flash"} size={24} color="white" />
        </LinearGradient>
        {edit ? (
          <TouchableOpacity
            style={styles.touchableField}
            onPress={()=> navigation.navigate("Action")}
          >
            <Text style={styles.propText}>{action || "Select action"}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#666" style={styles.editIcon} />
          </TouchableOpacity>
        ) : (
          <Text style={styles.propText}>{currentAutomation.action || "No details available."}</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  propContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  propContainerRow: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    alignSelf: "stretch",
  },
  propText: {
    fontFamily: "Lexend-Regular",
    fontSize: 18,
    textAlign: "left",
    flex: 1,
    flexShrink: 1,
    color: "#333",
  },
  input: {
    fontSize: 18,
    flex: 1,
    fontFamily: "Lexend-Regular",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderBottomWidth:1,
    borderBottomColor:'grey'
  },
  descriptionInput: {
    maxHeight: 200,
  },
  infoText: {
    fontFamily: "Lexend-Regular",
    fontSize: 15,
    textAlign: "left",
    marginBottom: 3,
    left: 5,
  },
  gradientIcon: {
    padding: 5,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableField: {
    flex: 1,
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,

  },
  editIcon: {
    marginLeft: 10, 
  },
});
