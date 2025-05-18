import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";

import HubsTabs from "../../../components/UI/HubsTabs";
import MainRoomList from "../../../components/ManageDevices/MainRoomList";
import InfoModal from "../../../components/UI/InfoModal";
import AddRoomModal from "../../../components/ManageDevices/AddRoomModal";

import useAreas from "../../../hooks/useAreas";
import useDevices from "../../../hooks/useDevices";

export default function ManageDevice({
  setAddModal,
  setCogModal,
  setInfoModal,
  infoModal,
  addModal,
  cogModal,
}) {
  const currentHub = useSelector((state) => state.hub.currentHub);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const [selectedTab, setSelectedTab] = useState(userHubs?.[0] ?? null);
  const [refreshing, setRefreshing] = useState(false);

  
  const { areas, isLoading: isLoadingAreas, refetchAreas } = useAreas(
    selectedTab?.serialNumber
  );

  const {
    devices: allDevices,
    isLoadingDevices,
    refetchDevices,
  } = useDevices(selectedTab?.serialNumber, areas);

  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchAreas();
      await refetchDevices();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const roomCount = areas.length;
  const deviceCount = allDevices.length;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <HubsTabs
        hubs={userHubs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <MainRoomList
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        areas={areas}
        isLoading={isLoadingAreas}
        refetchAreas={refetchAreas}
        roomCount={roomCount}
        deviceCount={deviceCount}
        devices={allDevices}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refetchDevices={refetchDevices}
      />

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message={
          "In this screen, you can add a new room or configure an existing one by selecting it"
        }
        title={"Manage Rooms"}
      />

      <AddRoomModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        title={`Add a room in ${selectedTab?.name || "Unknown"}`}
        refetchAreas={refetchAreas}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
