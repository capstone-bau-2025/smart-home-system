import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from "react-native";
import DeviceCard from "./DeviceCard";
import MoveDevice from "./MoveDevice";

export default function RoomModal({ visible, onClose, room }) {
  if (!room) return null; // Prevents errors if no room is selected

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
      
        <View style={styles.header}>
          <Text style={styles.roomName}>{room.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

      
        {room.devices.length > 0 ? (
          <FlatList
          ListHeaderComponent={<MoveDevice/>}
            data={room.devices}
            keyExtractor={(device) => device.id}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            renderItem={({ item: device }) => (
            <DeviceCard device={device} />
            )}
          />
        ) : (
          <Text style={styles.noDevices}>No devices available</Text>
        )}

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#FDF8F0", 
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  roomName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e19b19",
  },
  closeButton: {
    backgroundColor: "#e19b19",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  listContainer: {
    width: "90%",
    paddingVertical: 20,
  },

  noDevices: {
    fontSize: 18,
    fontStyle: "italic",
    color: "gray",
    marginTop: 20,
  },
});

