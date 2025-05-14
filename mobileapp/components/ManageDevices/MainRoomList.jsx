import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import RoomsGridList from "../UI/RoomsGridList";
import RoomModal from "./RoomModal";
import useAreas from "../../hooks/useAreas";

/// This component renders a list of rooms in the main room list screen
export default function MainRoomList({
  selectedTab,
  areas,
  isLoading,
  refetchAreas,
  roomCount,
  deviceCount,
  devices
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
 
  function clickHandler(room) {
    console.log(room);
    setSelectedRoom(room);
    setModalVisible(true);
  }

  if (!selectedTab) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent:'center'
        }}
      >
        <Text style={styles.noDevices}>No devices available</Text>
      </View>
    );
  }

  /*{selectedTab.rooms.map(room => ({
  ...room, 
  colors: room.colors || ["#FFA94D", "#ff9232"], 
  icon: room.icon || "home-outline"
}))}*/
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
        selectedRoom={selectedRoom}
        rooms={areas}

      />
    </>
  );
}

const styles = StyleSheet.create({
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
