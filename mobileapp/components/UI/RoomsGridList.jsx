import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import RoomCard from "../UI/RoomCard";


export default function RoomsGridList({ rooms, onRoomPress, devShown, editShown, color, devices }) {
  if (!rooms || rooms.length === 0) {
    return <Text style={styles.noRooms}>No rooms available</Text>;
  }

  return (
    <FlatList
      data={rooms}
      keyExtractor={(room) => room.id}
      numColumns={3}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item: room }) => {
        const roomDevices = devices?.filter((d) => d.areaId === room.id) || [];

        return (
          <RoomCard
            room={room}
            icon={room.icon}
            devices={roomDevices} 
            onPress={() => onRoomPress(room)}
            editShown={editShown}
            devShown={devShown}
            color={color}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { flexGrow: 1 },
  noRooms: { textAlign: "center", fontSize: 18, color: "#888", marginTop: 20 },
});
