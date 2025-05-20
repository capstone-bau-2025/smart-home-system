import { SafeAreaView, StyleSheet, View, Platform } from "react-native";
import AutomationsList from "../../components/AutomationScreen/AutomationsList";
import { useState, useEffect, useCallback } from "react";
import AutomationInfoModal from "../../components/AutomationScreen/AutomationInfoModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import BottomLeftBlob from "../../components/svg/BottomLeftBlob";
import InfoModal from "../../components/UI/InfoModal";
import HubsTabs from "../../components/UI/HubsTabs";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { getAllAutomations } from "../../api/services/automationService";
import { resetAutomation } from "../../store/slices/automationSlice";
import { useFocusEffect } from "@react-navigation/native";

export default function AutomationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const [selectedTab, setSelectedTab] = useState(userHubs?.[0] ?? null);
  const [automations, setAutomations] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllAutomations();
      setAutomations(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching automations:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAutomation());
    }, [])
  );
  const handleDeleteFromList = (id) => {
    setAutomations((prev) => prev.filter((item) => item.id !== id));
    handleRefresh();
  };

useFocusEffect(
  useCallback(() => {
    const fetchAutomations = async () => {
      try {
        const data = await getAllAutomations();
        setAutomations(data);
      } catch (error) {
        console.error("Error fetching automations:", error);
      }
    };

    fetchAutomations();
  }, [])
);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <BottomLeftBlob />

        <View style={styles.header}>
          <HeaderIcons
            onInfoPress={() => setInfoModal(true)}
            onAddPress={() => navigation.push("NewAutomation", {})}
            cogHidden={true}
          />
        </View>

        <View style={styles.body}>
          <HubsTabs
            hubs={userHubs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>
        <AutomationsList
          automations={automations}
          setModalVisible={setModalVisible}
          setCurrentAutomation={setCurrentAutomation}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          setAutomations={setAutomations}
        />

        <AutomationInfoModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          currentAutomation={currentAutomation}
          navigation={navigation}
          onDeleted={() => handleDeleteFromList(currentAutomation.id)}
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
