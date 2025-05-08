import { StyleSheet, View } from "react-native";
import { useState } from "react";
import ScrollableList from "../UI/ScrollableList";
import Toast from "react-native-toast-message";

//uses a scrollable list to display the automations
export default function AutomationsList({
  automations,
  currentHub,
  setModalVisible,
  setCurrentAutomation,
}) {
  const [autoState, setAutoState] = useState(automations);

  const handlePress = (item) => {
    setCurrentAutomation(item);
    setModalVisible(true);
  };

  const handleToggleAutomation = (automationId) => {
    let updatedStatus = "";
    let updatedName = "";
    setAutoState((prevAutomations) =>
      prevAutomations.map((item) => {
        if (item.id === automationId) {
          updatedStatus = item.status === "Active" ? "Inactive" : "Active";
          updatedName = item.name;
          return { ...item, status: updatedStatus };
        }
        return item;
      })
    );
    Toast.show({
      topOffset: 60,
      type: "success",
      text1: "Automation Updated",
      text2: `${updatedName} status is now ${updatedStatus}.`,
    });
  };

  const autoData = autoState.filter((item) => item.hubId === currentHub);

  return (
    <>
      <View style={styles.header}>
        {/* <Text style={styles.headerText}>Your Automations</Text> */}
      </View>

      <ScrollableList
        data={autoData}
        toggle={true}
        toggleSwitch={handleToggleAutomation}
        handlePress={handlePress}
        textFields={["name"]}
        pressableTab={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
  },
});
