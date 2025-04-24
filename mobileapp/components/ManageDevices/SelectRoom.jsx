import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../../constants/Colors";
import ConfirmationModal from "../UI/ConfirmationModal";
import RoomsGridList from "../UI/RoomsGridList";

// A modal that allows the user to select a room to move a device to
export default function SelectRoom({
  visible,
  onClose,
  room,
  selectedTab,
  selectedDevice,
}) {
  const [confirm, setConfirm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function pressHandler(newRoom) {
    setConfirm(true);
    setSelectedRoom(newRoom);
  }

  if (!room || !selectedTab) return null;

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      
      <View style={styles.modalContainer}>
        
        {/* Modal Header */}
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
          rooms={selectedTab.rooms.filter((r) => r.id !== room.id)}
          onRoomPress={pressHandler}
          devShown={false}

        />
    
          <ConfirmationModal
            visible={confirm}
            onClose={() => setConfirm(false)}
            onConfirm={() => {
              console.log(
                `Moved ${selectedDevice.name} to ${selectedRoom.name}`
              );
              setConfirm(false);
            }}
            iconName="repeat-outline"
            iconColor="#2d9f99"
            message={`Are you sure you want to move ${selectedDevice.name} to `}
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
  listContainer: {
    flexGrow: 1,
  },
  roomContainer: {
    height: 120,
    width: 120,
    marginVertical: 10,
    marginHorizontal: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontFamily: "Lexend-Regular",
  },
  info: {
    fontFamily: "Lexend-Regular",
    color: "#000000",
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  icon: {
    marginVertical: 8,
    color: "white",
  },
});
