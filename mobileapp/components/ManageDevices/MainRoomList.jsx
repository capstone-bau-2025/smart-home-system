import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import RoomsGridList from "../UI/RoomsGridList";
import RoomModal from "./RoomModal";

export default function MainRoomList({ selectedTab }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function clickHandler(room) {
    setSelectedRoom(room);
    setModalVisible(true);
  }

  if (!selectedTab || !selectedTab.rooms) {
    return <Text style={styles.noDevices}>No devices available</Text>;
  }

  return (
    <>
      <RoomsGridList 
        rooms={selectedTab.rooms.map(room => ({
          ...room, 
          colors: room.colors || ["#FFA94D", "#ff9232"], 
          icon: room.icon || "home-outline"
        }))} 
        onRoomPress={clickHandler} 
        devShown={true}
        editShown={true}
      />



        <RoomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          room={selectedRoom}
          selectedTab={selectedTab}
        />

    </>
  );
}

const styles = StyleSheet.create({
  noDevices: {
    textAlign: "center",
    marginTop: 20,
  },
});
