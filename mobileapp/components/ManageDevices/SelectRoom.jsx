import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import ConfirmationModal from "../UI/ConfirmationModal";
import RoomsGridList from "../UI/RoomsGridList";

export default function SelectRoom({
  visible,
  onClose,
  room,
  rooms = [],
  selectedTab,
  selectedDevice,
  onMove,
}) {
  const [confirm, setConfirm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function pressHandler(newRoom) {
    setSelectedRoom(newRoom);
    setConfirm(true);
  }

  if (!room || !selectedTab) return null;

  const availableRooms = rooms.filter((r) => r.id !== room.id);

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select a Room in {selectedTab.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.info}>
          Choose a room to move {selectedDevice.name} to
        </Text>

        <RoomsGridList
          rooms={availableRooms}
          onRoomPress={pressHandler}
          devShown={false}
        />

        <ConfirmationModal
          visible={confirm}
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            if (onMove && selectedRoom) onMove(selectedRoom.id);
            setConfirm(false);
          }}
          iconName="repeat-outline"
          iconColor="#ff9831"
          message={`Are you sure you want to move ${selectedDevice.name} to`}
          highlightedText={selectedRoom?.name}
          confirmLabel="Yes"
          cancelLabel="No"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
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
  title: {
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
  info: {
    fontFamily: "Lexend-Regular",
    color: "#000000",
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
