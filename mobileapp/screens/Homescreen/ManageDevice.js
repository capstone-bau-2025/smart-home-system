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

export default function ManageDevice() {
  const [selectedTab, setSelectedTab] = useState(hubs[0]);


  const roomCount = selectedTab.rooms.length;
  const deviceCount = selectedTab.rooms.reduce(
    (total, room) => total + room.devices.length,
    0
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <View style={styles.countContainer}>
          <Text style={styles.countText}>Rooms: {roomCount}</Text>
          <Text style={styles.countText}>Devices: {deviceCount}</Text>
        </View>

        <HubsTabs hubs={hubs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <MainRoomList selectedTab={selectedTab} setSelectedTab={setSelectedTab} hubs={hubs} />
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
});
