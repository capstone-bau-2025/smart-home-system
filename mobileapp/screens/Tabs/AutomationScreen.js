import { SafeAreaView, StyleSheet, View, Platform, } from "react-native";
import { automations } from "../../Data/Automations";
import AutomationsList from "../../components/AutomationScreen/AutomationsList";
import { useState } from "react";
import AutomationInfoModal from "../../components/AutomationScreen/AutomationInfoModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import BottomLeftBlob from "../../components/svg/BottomLeftBlob";
import InfoModal from "../../components/UI/InfoModal";
import HubsTabs from "../../components/UI/HubsTabs";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

export default function AutomationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const [selectedTab, setSelectedTab] = useState(userHubs?.[0] ?? null);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BottomLeftBlob />

        <View style={styles.header}>
          <HeaderIcons
            onInfoPress={() => setInfoModal(true)}
            onAddPress={() => navigation.push("NewAutomation")}
            cogHidden={true}
          />
        </View>

        <View style={styles.body}>
          <HubsTabs
            hubs={userHubs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />

          <AutomationsList
            automations={automations}
            setModalVisible={setModalVisible}
            setCurrentAutomation={setCurrentAutomation}
          />
        </View>

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
          message="In this screen, you can view and manage your automations. To add a new automation, click the '+' icon in the top right corner."
          title="Automation"
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
  },
  body: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
