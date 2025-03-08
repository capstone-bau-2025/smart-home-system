import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import RoomCard from "./RoomCard";
import RoomModal from "./RoomModal";

export default function RoomsList({ selectedTab }) {
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
      <FlatList
        data={selectedTab.rooms}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: room }) => (
          <RoomCard 
            room={room} 
            icon={room.icon} 
            devices={room.devices}  
            onPress={() => clickHandler(room)} 
          />
        )}
      />

      {/* Show Modal When Clicked */}
      {modalVisible && (
        <RoomModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)}
          room={selectedRoom} 
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    justifyContent: "flex-start", 
    alignItems: "flex-start",
  },
  noDevices: {
    textAlign: "center",
    marginTop: 20,
  },
});
