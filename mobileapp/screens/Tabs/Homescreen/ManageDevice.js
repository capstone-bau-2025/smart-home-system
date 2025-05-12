import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import HubsTabs from "../../../components/UI/HubsTabs";
import MainRoomList from "../../../components/ManageDevices/MainRoomList";
import InfoModal from "../../../components/UI/InfoModal";
import AddRoomModal from "../../../components/ManageDevices/AddRoomModal";
import useAreas from "../../../hooks/useAreas";
import { useSelector } from "react-redux";
import { getDeviceByArea } from "../../../api/services/deviceService";

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
  const devices = useSelector((state) => state.devices.devices);
  const { areas, isLoading, refetchAreas } = useAreas(
    selectedTab?.serialNumber
  );

  const [allDevices, setAllDevices] = useState(devices);

  // useEffect(() => {
  //   const fetchAllDevices = async () => {
  //     try {
  //       const all = await Promise.all(
  //         areas.map((area) =>
  //           getDeviceByArea(area.id, selectedTab.serialNumber)
  //         )
  //       );
  //       const flat = all.flat();
  //       console.log(flat, "devices from all rooms");
  //       setAllDevices(flat);
  //     } catch (err) {
  //       console.error("Error fetching devices for all rooms:", err);
  //     }
  //   };

  //   if (areas.length > 0 && selectedTab) {
  //     fetchAllDevices();
  //   }
  // }, [areas, selectedTab]);

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
        isLoading={isLoading}
        refetchAreas={refetchAreas}
        roomCount={roomCount}
        deviceCount={deviceCount}
        devices={allDevices}
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
