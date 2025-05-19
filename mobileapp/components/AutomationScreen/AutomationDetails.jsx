import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import DismissKeyboard from "../utils/DismissKeyboard";

export default function AutomationDetails({
  currentAutomation,
  edit,
  name,
  setName,
  description,
  setDescription,
  action,
  setAction,
  setModalVisible,
  navigation,
  setCooldown,
  cooldownDuration,
}) {
  const iconName = {
    schedule: "alarm-sharp",
    device_trigger: "eye-sharp",
    device_status_change: "bulb-sharp",
  };

  const paleIconBg = {
    schedule: "#eaffea",
    device_trigger: "#e3f0ff",
    device_status_change: "#efe3ff",
  };

  const iconColorMap = {
    schedule: "#3e914f",
    device_trigger: "#2f5fa3",
    device_status_change: "#6a11cb",
    action: "#244ced",
    cooldown: "#a37000",
  };

  const savedType = useSelector((state) => state.automation.type);
  const storedSelectedTime = useSelector(
    (state) => state.automation.selectedTime
  );
  const resolvedType = savedType || currentAutomation.type;

  const typeContent = {
    schedule: storedSelectedTime,
    device_trigger: "Event",
    device_status_change: "Device Status Change",
  };

  return (
    <DismissKeyboard>
      <View>
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
              maxLength={100}
              numberOfLines={1}
              max
              
            />
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.description || "No details available."}
            </Text>
          )}
        </View>

        <Text style={styles.infoText}>Type (If)</Text>
        <View style={styles.propContainerRow}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: paleIconBg[resolvedType] || "#ddd" },
            ]}
          >
            <Ionicons
              name={iconName[resolvedType] || "help-circle-outline"}
              size={24}
              color={iconColorMap[resolvedType] || "#333"}
            />
          </View>
          {edit ? (
            <TouchableOpacity
              style={styles.touchableField}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.propText}>
                {typeContent[resolvedType] || "Select type"}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#666"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.type || "No details available."}
            </Text>
          )}
        </View>

        <Text style={styles.infoText}>Action (Then)</Text>
        <View style={styles.propContainerRow}>
          <View style={[styles.iconWrapper, { backgroundColor: "#e7edff" }]}>
            <Ionicons name="flash" size={24} color={iconColorMap.action} />
          </View>
          {edit ? (
            <TouchableOpacity
              style={styles.touchableField}
              onPress={() => navigation.navigate("Action")}
            >
              <Text style={styles.propText}>{action || "Select action"}</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#666"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.action || "No details available."}
            </Text>
          )}
        </View>

        <Text style={styles.infoText}>Cool Down Duration (minutes)</Text>
        <View style={styles.propContainerRow}>
          <View style={[styles.iconWrapper, { backgroundColor: "#fff3cd" }]}>
            <Ionicons
              name="hourglass"
              size={24}
              color={iconColorMap.cooldown}
            />
          </View>
          {edit ? (
            <TextInput
              style={styles.propText}
              keyboardType="numeric"
              placeholder="Enter duration"
              value={cooldownDuration}
              onChangeText={setCooldown}
              placeholderTextColor="#999"
              maxLength={2}
            />
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.cooldownDuration
                ? `${currentAutomation.cooldownDuration} minutes`
                : "No details available."}
            </Text>
          )}
        </View>
      </View>
    </DismissKeyboard>
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
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
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
  iconWrapper: {
    padding: 6,
    borderRadius: 30,
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
