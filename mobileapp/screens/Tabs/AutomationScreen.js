import { SafeAreaView, StyleSheet, View, Platform } from "react-native";
import { automations } from "../../Data/Automations";
import AutomationsList from "../../components/AutomationScreen/AutomationsList";
import { useState } from "react";
import AutomationInfoModal from "../../components/AutomationScreen/AutomationInfoModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import BottomLeftBlob from "../../components/svg/BottomLeftBlob";
import InfoModal from "../../components/UI/InfoModal";
import HubsTabs from "../../components/UI/HubsTabs";
import Colors from "../../constants/Colors";
import { hubs } from "../../Data/Hubs";
import { StatusBar } from "expo-status-bar";


export default function AutomationScreen({ currentHub, navigation }) {


  const [modalVisible, setModalVisible] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(hubs[0]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar/>
        <View style={styles.header}>
          <HeaderIcons onInfoPress={() => setInfoModal(true)} onAddPress={() => navigation.push('NewAutomation')}/>
        </View>
        <HubsTabs
          hubs={hubs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        <AutomationsList
          automations={automations}
          currentHub={
            selectedTab.name.charAt(0).toUpperCase() + selectedTab.name.slice(1)
          }
          setModalVisible={setModalVisible}
          setCurrentAutomation={setCurrentAutomation}
        />

        <AutomationInfoModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          currentAutomation={currentAutomation}
          navigation={navigation}
        />

        <InfoModal
          visible={infoModal}
          onClose={() => setInfoModal(false)}
          cancelLabel="Close"
          iconName="help-outline"
          iconColor="orange"
          message={
            "In this screen, you can view and manage your automations. You can add or edit automations as needed. To add a new automation, click the '+' icon in the top right corner. To edit an existing automation, click on it in the list then press on 'Edit' "
          }
          title={"Automation"}
        />
        <BottomLeftBlob />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 30 : 0,

  },
});
