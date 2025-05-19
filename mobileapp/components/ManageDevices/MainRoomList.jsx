import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import RoomsGridList from "../UI/RoomsGridList";
import RoomModal from "./RoomModal";

export default function MainRoomList({
  selectedTab,
  areas,
  isLoading,
  refetchAreas,
  roomCount,
  deviceCount,
  devices,
  onRefresh,
  refreshing,
  refetchDevices
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function clickHandler(room) {
    setSelectedRoom(room);
    setModalVisible(true);
  }

  if (!selectedTab) {
    return (
      <View style={styles.noDevicesContainer}>
        <Text style={styles.noDevices}>No devices available</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>Rooms: {roomCount}</Text>
        <Text style={styles.countText}>Devices: {deviceCount}</Text>
      </View>

      <RoomsGridList
        rooms={areas}
        onRoomPress={clickHandler}
        devShown={true}
        editShown={true}
        devices={devices}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      <RoomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        selectedTab={selectedTab}
        setRoomModalVisible={setModalVisible}
        refetchAreas={refetchAreas}
        devices={devices}
        rooms={areas}
        refetchDevices={refetchDevices}
        setModalVisible={setModalVisible}
        setSelectedRoom={setSelectedRoom}
      />
    </>
  );
}

const styles = StyleSheet.create({
  noDevicesContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "center",
  },
  noDevices: {
    textAlign: "center",
    marginTop: 20,
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
