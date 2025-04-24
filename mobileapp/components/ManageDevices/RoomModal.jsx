import React, {  useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import SelectRoom from "./SelectRoom"; 
import ScrollableList from "../UI/ScrollableList";
import HeaderIcons from "../UI/HeaderIcons";
import InfoModal from "../UI/InfoModal";
import Colors from "../../constants/Colors";
import RenameModal from "../UI/RenameModal";
import { useNavigation } from '@react-navigation/native';
import ConfirmationModal from "../UI/ConfirmationModal";

//shows the devices inside the room clicked
export default function RoomModal({ visible, onClose, room, selectedTab,setVisible }) {
  const navigation = useNavigation();

  
  const [moveDevice, setMoveDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const[renameModal, setRenameModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false)
  const[confirmModal,setConfirmModal] = useState(false)
  function handleDevicePress(device) {
    setSelectedDevice(device);
    setMoveDevice(true); 
  }
  
  
  
  function handleAddPress(){
    
    navigation.push('DiscoverDevice') 
    setVisible(false); 
    
  }
  
  function handleRemovePress(device){
    setConfirmModal(true)
    setSelectedDevice(device);
  }
  
  function handleMovePress() {
    
    if (!selectedDevice && room.devices.length > 0) {
      setSelectedDevice(room.devices[0]); 
    }
    setMoveDevice(true);
  }
  
  function handleCloseRoomList() {
    setMoveDevice(false);
    setSelectedDevice(null);
  }
  
  if (!room) return null; 
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.roomName}>{room.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>


      <View style={styles.headerIcons}>
          <HeaderIcons  onInfoPress={() => setInfoModal(true)} onCogPress={() => setRenameModal(true)} onAddPress={() =>handleAddPress()}/>
        
      </View>

        <ScrollableList 
          data={room.devices}         
          textFields={["name"]} 
          buttonConfig={[
            { icon: "repeat-outline", onPress: (device) => handleDevicePress(device) }, 
            { icon: "pencil-outline", onPress: () => setRenameModal(true)},
            { icon: "remove-circle-outline", onPress: (device) => handleRemovePress(true)},
          ]}

        />
      
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
      <InfoModal visible={infoModal} onClose={() => setInfoModal(false)} cancelLabel="Close" iconName="help-outline" iconColor="orange"
      message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"} title={"Configuring a Room"}/>
      <ConfirmationModal  visible={confirmModal}  onClose={() => setConfirmModal(false)} message={`are you sure you want to remove this device`} 
      iconColor="red"  />

      <RenameModal visible={renameModal}  title={`change device name`} setVisible={setRenameModal} placeholder={'enter a new device name'} />
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
    borderBottomColor: "#c1c1c1",
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end", 
    paddingVertical:10,
    paddingHorizontal:15
    
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
  infoContainer: {
    justifyContent: "flex-start",
  },
  info: {
    fontSize: 20,
    color: "#2aa8a8",
    marginVertical: 10,
    fontFamily: "Lexend-Regular",
  },
});
