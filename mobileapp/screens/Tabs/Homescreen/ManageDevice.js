import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import HubsTabs from "../../../components/UI/HubsTabs";
import { useState } from "react";
import { hubs } from "../../../Data/Hubs";
import MainRoomList from "../../../components/ManageDevices/MainRoomList";
import HeaderIcons from "../../../components/UI/HeaderIcons";
import InfoModal from "../../../components/UI/InfoModal";
import AddRoomModal from "../../../components/ManageDevices/AddRoomModal";
import useAreas from "../../../hooks/useAreas";

export default function ManageDevice({
  currentHub,
  setAddModal,
  setCogModal, 
  setInfoModal,
  infoModal,
  addModal,
  cogModal,
}) {
  const [selectedTab, setSelectedTab] = useState(hubs[0]);
  const roomCount = selectedTab.rooms.length;
  const deviceCount = selectedTab.rooms.reduce(
    (total, room) => total + room.devices.length,
    0
  );

const { areas, isLoading, refetchAreas } = useAreas('123456789');
  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <HubsTabs
          hubs={hubs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <View style={styles.countContainer}>
          <Text style={styles.countText}>Rooms: {roomCount}</Text>
          <Text style={styles.countText}>Devices: {deviceCount}</Text>
        </View>

        <MainRoomList
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          hubs={hubs}
          areas={areas}
          isLoading={isLoading}
          refetchAreas={refetchAreas}
        />

        <InfoModal
          visible={infoModal}
          onClose={() => setInfoModal(false)}
          cancelLabel="Close"
          iconName="help-outline"
          iconColor="orange"
          message={
            "In this screen, you can configure rooms (rename), add, and delete..."
          }
          title={"Manage Rooms"}
        />

        <AddRoomModal
          visible={addModal}
          onClose={() => setAddModal(false)}
          title={`Add a room in ${selectedTab.name}`}
          refetchAreas={refetchAreas}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e19b19",
  },
});
