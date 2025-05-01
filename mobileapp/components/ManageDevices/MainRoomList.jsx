import React, { useState,useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import RoomsGridList from "../UI/RoomsGridList";
import RoomModal from "./RoomModal";
import useAreas from "../../hooks/useAreas";

/// This component renders a list of rooms in the main room list screen
export default function MainRoomList({ selectedTab,areas,isLoading,refetchAreas }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function clickHandler(room) {
    console.log(room)
    setSelectedRoom(room);
    setModalVisible(true);
  }

  if (!selectedTab || !selectedTab.rooms) {
    return <Text style={styles.noDevices}>No devices available</Text>;
  }



  


/*{selectedTab.rooms.map(room => ({
  ...room, 
  colors: room.colors || ["#FFA94D", "#ff9232"], 
  icon: room.icon || "home-outline"
}))}*/ 
  return (
    <>
      <RoomsGridList 
        rooms={areas} 
        onRoomPress={clickHandler} 
        devShown={true}
        editShown={true}
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
