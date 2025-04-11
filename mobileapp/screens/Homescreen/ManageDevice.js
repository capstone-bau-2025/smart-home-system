import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HubsTabs from "../../components/ManageHub/HubsTabs";
import { useState } from "react";
import { hubs } from "../../Data/Hubs";
import MainRoomList from "../../components/ManageDevices/MainRoomList";
import HeaderIcons from "../../components/UI/HeaderIcons";
import InfoModal from "../../components/UI/InfoModal";
import AddRoomModal from "../../components/ManageDevices/AddRoomModal";

export default function ManageDevice() {
  const [selectedTab, setSelectedTab] = useState(hubs[0]);
  const [addModal, setAddModal] = useState(false);
  const [cogModal, setCogModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const roomCount = selectedTab.rooms.length;
  const deviceCount = selectedTab.rooms.reduce(
    (total, room) => total + room.devices.length,
    0
  );

  return (
    <GestureHandlerRootView>
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
        <View style={styles.headerIcons}>
          <HeaderIcons
            onInfoPress={() => setInfoModal(true)}
            onAddPress={() => setAddModal(true)}
            onCogPress={() => console.log("Cog pressed, rename room and delete")}
          />
        </View>

        <MainRoomList
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          hubs={hubs}
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

      <AddRoomModal visible={addModal} onClose={() => setAddModal(false)} title={`Add a room in ${selectedTab.name}`} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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

  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
