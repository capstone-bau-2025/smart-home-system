import { SafeAreaView, StyleSheet, View, Platform } from "react-native";
import { automations } from "../../Data/Automations";
import AutomationsList from "../../components/AutomationScreen/AutomationsList";
import { useState } from "react";
import AutomationInfoModal from "../../components/AutomationScreen/AutomationInfoModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import BottomLeftBlob from "../../components/svg/BottomLeftBlob";
import InfoModal from "../../components/UI/InfoModal";
import HubsTabs from "../../components/ManageHub/HubsTabs";
import Colors from "../../constants/Colors";
import { hubs } from "../../Data/Hubs";
import { StatusBar } from "react-native";

export default function AutomationScreen({ currentHub, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(hubs[0]);

  return (
    <>
      <BottomLeftBlob />
      <SafeAreaView >
        <View style={styles.header}>
          <HeaderIcons onInfoPress={() => setInfoModal(true)} />
        </View>

        <View style={styles.container}>
          <HubsTabs
            hubs={hubs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          <AutomationsList
            automations={automations}
            currentHub={
              selectedTab.name.charAt(0).toUpperCase() +
              selectedTab.name.slice(1)
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
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"
            }
            title={"Automation"}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",

    
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
