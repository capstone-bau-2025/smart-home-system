import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import SelectRoom from "./SelectRoom";
import ScrollableList from "../UI/ScrollableList";
import HeaderIcons from "../UI/HeaderIcons";
import InfoModal from "../UI/InfoModal";
import Colors from "../../constants/Colors";
import RenameModal from "../UI/RenameModal";
import { useNavigation } from "@react-navigation/native";
import ConfirmationModal from "../UI/ConfirmationModal";
import { Ionicons } from "@expo/vector-icons";
import { deleteRoom } from "../../api/services/areaService";
import Toast from "react-native-toast-message";
//shows the devices inside the room clicked
export default function RoomModal({
  visible,
  onClose,
  room,
  selectedTab,
  setRoomModalVisible,
  refetchAreas,
}) {
  const navigation = useNavigation();

  const [moveDevice, setMoveDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [renameModal, setRenameModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleDevicePress(device) {
    setSelectedDevice(device);
    setMoveDevice(true);
  }

  function handleAddPress() {
    navigation.push("DiscoverDevice");
    setRoomModalVisible(false);
  }

  function handleRemovePress(device) {
    setConfirmModal(true);
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

  // console.log(room.name)
  // console.log(room.id)
  async function handleDeleteRoom(areaId, hubSerialNumber) {
    try {
      const result = await deleteRoom(areaId, hubSerialNumber);
      setDeleteConfirm(false);
      await refetchAreas();
      setSelectedDevice(null);
      setMoveDevice(false);
      console.log("Room deleted successfully");
    
      setTimeout(() => {
        onClose(); 
        Toast.show({
          topOffset: 60,
          swipeable: true,
          type: "success",
          text1: "Deletion Successful",
          text2: `${room.name} has been deleted successfully`
        });
      }, 500);

    } catch (error) {
      console.log("Error while deleting room:", error.message || error);
    }
  }
  if (!visible || !room?.name) return null;

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={styles.roomName}>{room?.name || ""}</Text>

            <TouchableOpacity
              onPress={() => setDeleteConfirm(true)}
              style={styles.deleteRoomBtn}
            >
              <Ionicons name="trash-outline" size={20} color="#000000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerIcons}>
          <HeaderIcons
            onInfoPress={() => setInfoModal(true)}
            onCogPress={() => setRenameModal(true)}
            onAddPress={() => handleAddPress()}
          />
        </View>

        <ScrollableList
          data={room.devices}
          textFields={["name"]}
          buttonConfig={[
            {
              icon: "repeat-outline",
              onPress: (device) => handleDevicePress(device),
            },
            { icon: "pencil-outline", onPress: () => setRenameModal(true) },
            {
              icon: "remove-circle-outline",
              onPress: (device) => handleRemovePress(device),
            },
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

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message={"Here, you can manage this room by moving or removing devices, or deleting the room entirely."}
        title={"Configuring a Room"}
      />

      <ConfirmationModal
        visible={confirmModal}
        onClose={() => setConfirmModal(false)}
        message={`Are you sure you want to remove this device?`}
        iconColor="red"
      />

      <ConfirmationModal
        visible={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        message={`Are you sure you want to delete the room "${room.name}"?`}
        iconColor="red"
        onConfirm={() => handleDeleteRoom(room.id, "123456789")}
      />

      <RenameModal
        visible={renameModal}
        title={`Change device name`}
        setVisible={setRenameModal}
        placeholder={"Enter a new device name"}
      />
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
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  deleteRoomBtn: {
    backgroundColor: "#ecaa2f",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
