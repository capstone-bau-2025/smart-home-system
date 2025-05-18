import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import DeviceCard from "./DeviceCard";
import { iconOptions } from "../../util/helperFunctions";
import { useSelector } from "react-redux";

// Holds the rooms and devices under them
export default function RoomCard({ data }) {
  //the data here is the room data
  const iconName = iconOptions[data.icon];
  const leftColumn = [];
  const rightColumn = [];
  let leftHeight = 0;
  let rightHeight = 0;

  const devices = useSelector((state) => state.devices.interactions); 
  //fetch interactions from redux store
  const roomDevices = devices.filter((d) => d.areaId === data.id);

  const getDeviceHeight = (device) =>
    device.type === "ENUM" || device.type === "RANGE" ? 135 : 60;

  roomDevices.forEach((device) => {
    const estimatedHeight = getDeviceHeight(device);

    if (leftHeight <= rightHeight) {
      leftColumn.push(device);
      leftHeight += estimatedHeight;
    } else {
      rightColumn.push(device);
      rightHeight += estimatedHeight;
    }
  });

  return (
    <View style={styles.entireRoom}>
      {/* Room Header */}
      <View style={styles.roomHeader}>
        <Ionicons
          name={data.name === "GENERAL" ? "apps-outline" : iconName}
          style={styles.icon}
          size={25}
        />
        <Text style={styles.roomName}>{data.name}</Text>
      </View>

    {/* {devices.length === 0 && (
        <Text style={{ fontSize: 16, color: "#888" }}>
          No devices in this room
        </Text>
      )} */}


      {/* Balanced Two Column Layout */}
      <View style={styles.twoColumnGrid}>
        <View style={styles.column}>
          {leftColumn.map((device) => (
            <DeviceCard
              key={
                device.stateValueId ||
                device.commandId ||
                `${device.deviceId}-${device.name}`
              }
              data={device}
            />
          ))}
        </View>
        <View style={styles.column}>
          {rightColumn.map((device) => (
            <DeviceCard
              key={
                device.stateValueId ||
                device.commandId ||
                `${device.deviceId}-${device.name}`
              }
              data={device}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entireRoom: {
    marginBottom: 5,
  },
  roomHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  roomName: {
    fontSize: 20,
    fontFamily: "Lexend-Regular",
  },
  twoColumnGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
});
