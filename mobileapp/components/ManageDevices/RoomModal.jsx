import React, { useState, useEffect } from "react";
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
import Toast from "react-native-toast-message";

import {
  updateDeviceName,
  deleteDevice,
  updateDeviceArea,
} from "../../api/services/deviceService";
import { deleteRoom } from "../../api/services/areaService";

export default function RoomModal({
  visible,
  onClose,
  room,
  selectedTab,
  setRoomModalVisible,
  refetchAreas,
  devices,
  rooms
}) {
  const navigation = useNavigation();

  const [moveDevice, setMoveDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [renameModal, setRenameModal] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [deleteDeviceModal, setDeleteDeviceModal] = useState(false);
  const [deleteRoomModal, setDeleteRoomModal] = useState(false);

  function handleDevicePress(device) {
    setSelectedDevice(device);
    setMoveDevice(true);
  }

  function handleAddPress() {
    navigation.push("DiscoverDevice");
    setRoomModalVisible(false);
  }

  function handleRemovePress(device) {
    setDeleteDeviceModal(true);
    setSelectedDevice(device);
  }

  async function handleDeleteDevice() {
    try {
      await deleteDevice(
        selectedDevice.id,
        selectedTab.localToken,
        selectedTab.serialNumber
      );
      Toast.show({
        type: "success",
        text1: "Device removed",
      });
      await refetchAreas();
      setDeleteDeviceModal(false);
      setSelectedDevice(null);
    } catch (err) {
      console.error("Failed to delete device", err);
    }
  }

  async function handleDeleteRoom(areaId, hubSerialNumber) {
    try {
      await deleteRoom(areaId, hubSerialNumber);
      await refetchAreas();
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: "Room deletion successful",
        text2: `${room.name} was deleted`,
      });
      onClose();
    } catch (error) {
      console.log("Error deleting room:", error.message || error);
    }
  }

  useEffect(() => {
    const renameDevice = async () => {
      if (selectedDevice && renameText.trim()) {
        try {
          await updateDeviceName(
            selectedDevice.id,
            renameText,
            selectedTab.localToken,
            selectedTab.serialNumber
          );
          Toast.show({
            type: "success",
            text1: "Renamed",
            text2: `Device renamed to ${renameText}`,
          });
          setRenameText("");
          await refetchAreas();
        } catch (err) {
          console.error("Rename failed", err);
        }
      }
    };

    if (!renameModal) renameDevice();
  }, [renameModal]);

  if (!visible || !room?.name) return null;

  const roomDevices = devices.filter((d) => d.areaId === room.id);

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={styles.roomName}>{room?.name || ""}</Text>
            <TouchableOpacity
              onPress={() => setDeleteRoomModal(true)}
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
                setRenameText(device.name);
                setRenameModal(true);
              },
            },
            {
              icon: "remove-circle-outline",
              onPress: handleRemovePress,
            },
          ]}
        />

        {moveDevice && (
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
            onMove={async (targetRoomId) => {
              try {
                await updateDeviceArea(
                  selectedDevice.id,
                  targetRoomId,
                  selectedTab.localToken,
                  selectedTab.serialNumber
                );
                Toast.show({ type: "success", text1: "Device moved" });
                await refetchAreas();
              } catch (err) {
                console.error("Failed to move device", err);
              } finally {
                setMoveDevice(false);
              }
            }}
          />
        )}
      </View>

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
        message={`Are you sure you want to delete the device "${selectedDevice?.name}"?`}
        iconColor="red"
        onConfirm={handleDeleteDevice}
      />

      <ConfirmationModal
        visible={deleteRoomModal}
        onClose={() => setDeleteRoomModal(false)}
        message={`Are you sure you want to delete the room "${room.name}"?`}
        iconColor="red"
        onConfirm={() => handleDeleteRoom(room.id, selectedTab.serialNumber)}
      />

      <RenameModal
        visible={renameModal}
        title="Rename Device"
        value={renameText}
        onChange={setRenameText}
        setVisible={setRenameModal}
        placeholder="Enter new name"
        onConfirm={() => {}}
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
