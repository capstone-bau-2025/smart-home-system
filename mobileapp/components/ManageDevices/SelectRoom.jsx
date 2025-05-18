import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import Colors from "../../constants/Colors";
import ConfirmationModal from "../UI/ConfirmationModal";
import RoomsGridList from "../UI/RoomsGridList";
 
const { width, height } = Dimensions.get("window");

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
  const [deviceName, setDeviceName] = useState("");
  const opacity = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
        setConfirm(false);
      });
    }
  }, [visible]);

  useEffect(() => {
    if (visible && selectedDevice?.name) {
      setDeviceName(selectedDevice.name);
    }
  }, [visible, selectedDevice?.id]);

  if (!shouldRender || !room || !selectedTab || !selectedDevice) return null;

  const availableRooms = rooms.filter((r) => r.id !== room.id);

  const pressHandler = (newRoom) => {
    setSelectedRoom(newRoom);
    setConfirm(true);
  };

  return (
    <Animated.View style={[styles.fullscreen, { opacity }]}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select a Room in {selectedTab.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.info}>You're moving: {deviceName}</Text>

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
          message={`Are you sure you want to move ${deviceName} to`}
          highlightedText={selectedRoom?.name || ""}
          confirmLabel="Yes"
          cancelLabel="No"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    height,
    width,
    zIndex: 999,
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    height,
    width,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
    fontSize: 18,
    marginBottom: 10,
  },
});
