import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from "react-native";
import DeviceCard from "../UI/DeviceCard"
import MoveDevice from "./MoveDevice";
import SelectRoom from "./SelectRoom"; // Import RoomListModal

export default function RoomModal({ visible, onClose, room,selectedTab }) {
  if (!room) return null; // Prevents errors if no room is selected
  
  const [moveDevice, setMoveDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  function handleDevicePress(device) {
    setSelectedDevice(device);
    setMoveDevice(true); 
  }

  function handleCloseRoomList() {
    setMoveDevice(false); 
    setSelectedDevice(null);
  }

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        

        <View style={styles.header}>
          
          <Text style={styles.roomName}>{room.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.infoContainer}>
            <Text style={styles.info}>Move a device to another room</Text>
        </View>
        {room.devices.length > 0 ? (
          <FlatList
            ListHeaderComponent={<MoveDevice room={room} selectedTab={selectedTab} selectedDevice={selectedDevice}  setSelectedDevice={setSelectedDevice } />}
            data={room.devices}
            keyExtractor={(device) => device.id}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            renderItem={({ item: device }) => (
              <DeviceCard device={device} onPress={() => handleDevicePress(device)} />
            )}
          />
        ) : (
          <Text style={styles.noDevices}>No devices available</Text>
        )}

    
        {moveDevice && (
          <SelectRoom 
            visible={moveDevice} 
            onClose={handleCloseRoomList} 
            room={room} 
            selectedTab={selectedTab}
            selectedDevice={selectedDevice}
            
          />
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

  },
  noDevices: {
    fontSize: 18,
    fontStyle: "italic",
    color: "gray",
    marginTop: 20,
  },
  info: {
    fontSize: 20,
    color: "#2aa8a8",
    marginVertical:10,
    fontFamily: "Lexend-Regular",
    
  },
  infoContainer:{
    justifyContent:'flex-start',
    
  }
});
