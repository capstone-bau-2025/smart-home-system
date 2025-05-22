import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import AutomationDetails from "../../../components/AutomationScreen/AutomationDetails";
import FooterButtons from "../../../components/AutomationScreen/FooterButtons";
import TypeModal from "../../../components/AutomationScreen/TypeModal";
import Colors from "../../../constants/Colors";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";
import { createAutomationRule } from "../../../api/services/automationService";
import { resetAutomation } from "../../../store/slices/automationSlice";

export default function NewAutomation({ route, navigation }) {
  const { currentAutomation } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  //fetch createauto values from the redux store
  const ruleName = useSelector((state) => state.automation.ruleName);
  const ruleDescription = useSelector(
    (state) => state.automation.ruleDescription
  );
  const triggerType = useSelector((state) => state.automation.triggerType);
  const scheduledTime = useSelector((state) => state.automation.scheduledTime);
  const cooldownDuration = useSelector(
    (state) => state.automation.cooldownDuration
  );
  const eventId = useSelector((state) => state.automation.eventId);
  const deviceId = useSelector((state) => state.automation.deviceId);
  const stateValueId = useSelector((state) => state.automation.stateValueId);
  const stateTriggerValue = useSelector(
    (state) => state.automation.stateTriggerValue
  );
  const actions = useSelector((state) => state.automation.actions);

  const handleSave = async () => {
    const payload = {
      ruleName,
      ruleDescription,
      triggerType,
      scheduledTime,
      cooldownDuration,
      eventId,
      deviceId,
      stateValueId,
      stateTriggerValue,
      actions,
    };

    console.log("🚨 Payload before sending:", payload);
    try {
      await createAutomationRule({
        ruleName,
        ruleDescription,
        triggerType,
        scheduledTime,
        cooldownDuration,
        eventId,
        deviceId,
        stateValueId,
        stateTriggerValue,
        actions,
      });

      Toast.show({
        type: "success",
        text1: "Automation created",
        text2: "Automation has been created successfully.",
        position: "top",
        topOffset: 60,
        swipeable: true,
      });
      if (route.params?.onAutomationCreated) {
        route.params.onAutomationCreated();
      }
      navigation.goBack();
    } catch (err) {
      console.error("❌ Failed to create automation:", err);
      Toast.show({
        type: "error",
        text1: "Failed to create automation",
        text2: "Something went wrong. Try again.",
        position: "top",
        topOffset: 60,
      });
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AutomationDetails
          edit={true}
          setModalVisible={setModalVisible}
          navigation={navigation}
          currentAutomation={currentAutomation}
        />

        <FooterButtons
          handleCloseModal={() => navigation.goBack()}
          handleSave={handleSave}
          create={true}
          hideClose={true}
        />
      </View>

      <TypeModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSelect={(type) => {
          navigation.navigate(type);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  container: {
    paddingTop: Platform.OS === "android" ? 100 : 0,
    padding: 20,
    justifyContent: "center",
  },
});
