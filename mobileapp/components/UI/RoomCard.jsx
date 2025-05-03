import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { iconOptions } from "../../util/helperFunctions";

export default function RoomCard({
  room,
  icon,
  devices,
  color,
  iconColor = "white",
  onPress,
  devShown,
  editShown,
}) {
  const isGeneral = room.name === "GENERAL";

  const iconName = isGeneral ? "apps-outline" : iconOptions[icon];
  const iconTint = isGeneral ? "#000" : iconColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={isGeneral ? styles.generalContainer : styles.roomContainer}
    >
      <View
        style={[
          styles.content,
          isGeneral
            ? styles.generalRoom
            : { backgroundColor: color || Colors.primary100 },
        ]}
      >
        {/* Room Name */}
        <Text style={isGeneral ? styles.generalName : styles.roomName}>
          {room.name}
        </Text>

        {/* Icon */}
        <Ionicons
          style={styles.icon}
          name={iconName}
          size={30}
          color={iconTint}
        />

        {/* Device count & edit */}
        {devShown !== false && (
          <View style={styles.deviceContainer}>
            <Text
              style={[
                styles.deviceCount,
                isGeneral && { color: "#333" },
              ]}
            >
              {devices?.length || 0} Devices
            </Text>

            {editShown !== false && (
              <Ionicons
                name="create-outline"
                size={18}
                color={isGeneral ? "#333" : "white"}
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const baseSize = Platform.OS === "ios" ? 120 : 110;

const styles = StyleSheet.create({
  roomContainer: {
    height: baseSize,
    width: baseSize,
    marginVertical: 10,
    marginHorizontal: 7,
    borderRadius: 20,
    overflow: "hidden",
  },
  generalContainer: {
    height: baseSize,
    width: baseSize,
    marginVertical: 10,
    marginHorizontal: 7,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "gold",
    backgroundColor: "#fff8e1",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  generalRoom: {
    backgroundColor: "#fff8e1",
  },
  roomName: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontFamily: "Lexend-Regular",
  },
  generalName: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    fontFamily: "Lexend-Bold",
  },
  icon: {
    marginVertical: 8,
  },
  deviceCount: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
    fontFamily: "Lexend-Regular",
  },
  deviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
