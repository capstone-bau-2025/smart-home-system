import { StyleSheet, View } from "react-native";
import { useState } from "react";
import ScrollableList from "../UI/ScrollableList";
import Toast from "react-native-toast-message";
import { updateAutomationStatus } from "../../api/services/automationService";

//uses a scrollable list to display the automations
export default function AutomationsList({
  automations,
  currentHub,
  setModalVisible,
  setCurrentAutomation,
  onRefresh,
  setAutomations,
  refreshing,
}) {
  const handlePress = (item) => {
    setCurrentAutomation(item);

    setModalVisible(true);
  };

  
const handleToggleAutomation = async (ruleId, currentStatus, name) => {
  const updatedStatus = !currentStatus;

  
  setAutomations((prev) =>
    prev.map((item) =>
      item.id === ruleId ? { ...item, isEnabled: updatedStatus } : item
    )
  );

  try {
    await updateAutomationStatus(ruleId, updatedStatus);

    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Automation Updated",
      text2: `${name} is now ${updatedStatus ? "enabled" : "disabled"}.`,
    });
  } catch (err) {
    console.error("Toggle error:", err);


    setAutomations((prev) =>
      prev.map((item) =>
        item.id === ruleId ? { ...item, isEnabled: currentStatus } : item
      )
    );

    Toast.show({
      type: "error",
      text1: "Failed to update automation",
      text2: "Please try again.",
      topOffset: 60,
    });
  }
};

  return (
    <>
      <ScrollableList
        data={automations}
        toggle={true}
        toggleSwitch={handleToggleAutomation}
        handlePress={handlePress}
        textFields={["ruleName"]}
        pressableTab={true}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </>
  );
}

const styles = StyleSheet.create({});
