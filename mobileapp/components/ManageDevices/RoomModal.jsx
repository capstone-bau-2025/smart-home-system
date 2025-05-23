import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

import ScrollableList from "../UI/ScrollableList";
import SelectRoom from "./SelectRoom";
import HeaderIcons from "../UI/HeaderIcons";
import InfoModal from "../UI/InfoModal";
import RenameModal from "../UI/RenameModal";
import ConfirmationModal from "../UI/ConfirmationModal";
import Colors from "../../constants/Colors";

import {
  updateDeviceName,
  deleteDevice,
  updateDeviceArea,
} from "../../api/services/deviceService";
import { deleteRoom } from "../../api/services/areaService";
import { store } from "../../store/store";

export default function RoomModal({
  visible,
  onClose,
  room,
  selectedTab,
  setRoomModalVisible,
  refetchAreas,
  devices,
  rooms,
  refetchDevices,
  setSelectedRoom,
  setModalVisible,
}) {
  const navigation = useNavigation();
  const localToken = store.getState().user.localToken;
  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;

  const [moveDevice, setMoveDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [renameModal, setRenameModal] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [deleteDeviceModal, setDeleteDeviceModal] = useState(false);
  const [deleteRoomModal, setDeleteRoomModal] = useState(false);

  useEffect(() => {
    setRenameText(selectedDevice?.name || "");
  }, [selectedDevice]);

  const handleDevicePress = (device) => {
    setSelectedDevice(device);
    setMoveDevice(true);
  };

  const handleMoveDevice = async (targetRoomId) => {
    if (!selectedDevice?.id) return;

    try {
      await updateDeviceArea(
        selectedDevice.id,
        targetRoomId,
        localToken,
        hubSerialNumber
      );

      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: "Device moved",
        text2: `Device has been moved to ${
          rooms.find((r) => r.id === targetRoomId)?.name
        }`,
      });
    } catch (err) {
      console.error("Failed to move device", err);
    } finally {
      setMoveDevice(false);
      setSelectedDevice(null);
      await Promise.all([refetchAreas(), refetchDevices()]);
    }
  };

  const handleAddPress = () => {
    navigation.push("DiscoverDevice");
    setRoomModalVisible(false);
  };

  const handleRemovePress = (device) => {
    setDeleteDeviceModal(true);
    setSelectedDevice(device);
  };

  const handleDeleteDevice = async () => {
    try {
      await deleteDevice(selectedDevice.id, localToken, hubSerialNumber);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: "Device deletion successful",
        text2: `${selectedDevice.name} was deleted`,
      });
      await Promise.all([refetchAreas(), refetchDevices()]);
      setDeleteDeviceModal(false);
      setSelectedDevice(null);
    } catch (err) {
      console.error("Failed to delete device", err);
    }
  };

  const handleDeleteRoom = async (areaId, hubSerialNumber) => {
    try {
      await deleteRoom(areaId, hubSerialNumber);
      await Promise.all([refetchAreas(), refetchDevices()]);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: "Room deletion successful",
        text2: `${room.name} was deleted`,
      });
      
      setDeleteRoomModal(false);

      setTimeout(() => setSelectedRoom(null), 500);
    } catch (error) {
      console.error("Error deleting room:", error.message || error);
    }
  };

  const handleRenameDevice = async (newName) => {
    if (!selectedDevice || !newName.trim()) return;

    try {
      await updateDeviceName(selectedDevice.id, newName, localToken);
      await Promise.all([refetchAreas(), refetchDevices()]);
      setRenameModal(false);
      setRenameText("");
      setSelectedDevice(null);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: "Renamed",
        text2: `Device renamed to ${newName}`,
      });
    } catch (error) {
      console.error("Rename failed:", error);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "error",
        text1: "Rename failed",
        text2: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (!visible || !room?.name) return null;

  const roomDevices = devices.filter((d) => d.areaId === room.id);

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={styles.roomName}>{room?.name || ""}</Text>
            {room?.name !== "GENERAL" && (
              <TouchableOpacity
                onPress={() => setDeleteRoomModal(true)}
                style={styles.deleteRoomBtn}
              >
                <Ionicons name="trash-outline" size={20} color="#000000" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerIcons}>
          <HeaderIcons
            onInfoPress={() => setInfoModal(true)}
            cogHidden={true}
            onAddPress={handleAddPress}
          />
        </View>

        <ScrollableList
          data={roomDevices}
          textFields={["name"]}
          buttonConfig={[
            {
              icon: "repeat-outline",
              onPress: handleDevicePress,
            },
            {
              icon: "pencil-outline",
              onPress: (device) => {
                setSelectedDevice(device);
                setRenameModal(true);
              },
            },
            {
              icon: "remove-circle-outline",
              onPress: handleRemovePress,
            },
          ]}
          noData="No devices in this room"
        />
      </View>

      <SelectRoom
        visible={moveDevice}
        onClose={() => {
          setMoveDevice(false);
          setSelectedDevice(null);
        }}
        room={room}
        rooms={rooms}
        selectedTab={selectedTab}
        selectedDevice={selectedDevice}
        onMove={handleMoveDevice}
      />

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message="You can move, remove, or rename devices from this room. Or delete the room entirely."
        title="Room Config"
      />

      <ConfirmationModal
        visible={deleteDeviceModal}
        onClose={() => setDeleteDeviceModal(false)}
        message={`Are you sure you want to delete this device?`}
        iconColor="red"
        onConfirm={handleDeleteDevice}
      />

      <ConfirmationModal
        visible={deleteRoomModal}
        onClose={() => setDeleteRoomModal(false)}
        message={`Are you sure you want to delete this room?`}
        iconColor="red"
        onConfirm={() => handleDeleteRoom(room.id, selectedTab.serialNumber)}
      />

      <RenameModal
        visible={renameModal}
        title="Rename Device"
        value={renameText}
        setValue={setRenameText}
        setVisible={setRenameModal}
        placeholder="Enter new name"
        onConfirm={handleRenameDevice}
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
    paddingBottom: 30,
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
