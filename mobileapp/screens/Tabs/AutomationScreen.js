import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { automations } from "../../Data/Automations";
import AutomationsList from "../../components/AutomationScreen/AutomationsList";
import { useState } from "react";
import AutomationInfoModal from "../../components/AutomationScreen/AutomationInfoModal";

export default function AutomationScreen({ currentHub, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null); 

  return (
    <SafeAreaView style={styles.container}>
      <AutomationsList
        automations={automations}
        currentHub={currentHub}
        setModalVisible={setModalVisible}
        setCurrentAutomation={setCurrentAutomation} 
      />


        <AutomationInfoModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          currentAutomation={currentAutomation}
          navigation={navigation} 
        />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
