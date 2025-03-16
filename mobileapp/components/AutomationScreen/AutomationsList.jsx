import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import AutomationCard from "./AutomationCard";

export default function AutomationsList({
  automations,
  currentHub,
  modalVisible,
  setModalVisible,
  setCurrentAutomation
}) {
  const [autoState, setAutoState] = useState(automations);


  const handleToggleAutomation = (automationId) => {
    let updatedStatus = "";

    setAutoState((prevAutomations) =>
      prevAutomations.map((item) => {
        if (item.id === automationId) {
          updatedStatus = item.status === "Active" ? "Inactive" : "Active";
          return { ...item, status: updatedStatus };
        }
        return item;
      })
    );

    Alert.alert("Automation Status", `The automation status is now ${updatedStatus}`);
  };

  const autoData = autoState.filter((item) => item.hubId === currentHub);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Automations</Text>
      </View>

      <FlatList
        data={autoData}
        ListFooterComponent={
          <View style={styles.addContainer}>
            <Ionicons name="add-outline" size={30} color="black"/>
          </View>
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AutomationCard
            handleToggleAutomation={handleToggleAutomation}
            item={item}
            setModalVisible={setModalVisible}
            setCurrentAutomation={setCurrentAutomation} 
  
          />
          
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
    marginTop: Platform.OS === 'android' ? 35 : null, 

  },

  pressed: {
    opacity: 0.7,
  },

  addContainer: {
    right: 15,
    alignSelf: "flex-end",
  },
});
