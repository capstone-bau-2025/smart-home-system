import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function RoomCard({
  room,
  icon,
  devices,
  colors = ["#e6e277", "#e7901f"],
  iconColor = "white",
  onPress,
  devShown,
  editShown,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.roomContainer}>
      <LinearGradient
        colors={colors} // Apply passed colors or default
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.content}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Ionicons
            style={[styles.icon, { color: iconColor }]}
            name={icon}
            size={30}
          />

          {devShown !== false && (
            <View style={styles.deviceContainer}>
              <Text style={styles.deviceCount}>
                {devices?.length || 0} Devices {""}
              </Text>

              {editShown !== false && (
                <Ionicons name="create-outline" size={18} color="white" />
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    fontFamily:"Lexend-Regular"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  icon: { marginVertical: 8 },
  deviceCount: { fontSize: 14, color: "white", marginTop: 5,fontFamily:"Lexend-Regular" },
  deviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
