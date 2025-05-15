import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import RoomCard from "../UI/RoomCard";

export default function RoomsGridList({
  rooms,
  onRoomPress,
  devShown,
  editShown,
  color,
  devices,
  excludedRoomId, 
  onRefresh,
  refreshing
}) {
  
  const filteredRooms = excludedRoomId
    ? rooms.filter((room) => room.id !== excludedRoomId)
    : rooms;


  if (!filteredRooms || filteredRooms.length === 0) {
    return <Text style={styles.noRooms}>No rooms available</Text>;
  }
 
  return (
    <FlatList
      data={filteredRooms}
      keyExtractor={(room) => room.id.toString()}
      numColumns={3}
      contentContainerStyle={styles.listContainer}
      onRefresh={onRefresh}
      refreshing={refreshing}
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
