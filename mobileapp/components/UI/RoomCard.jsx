import React from "react";
import { TouchableOpacity, Text, View, StyleSheet,Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function RoomCard({
  room,
  icon,
  devices,
  colors = ["#e9aa22", "#f3b96d"],
  iconColor = "white",
  onPress,
  devShown,
  editShown,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.roomContainer}>

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

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roomContainer: {
    height: Platform.OS === 'ios' ? 120 : 110,
    width: Platform.OS === 'ios' ? 120 : 110,
    marginVertical: 10,
    marginHorizontal: 7,
    borderRadius: 20,

    overflow: "hidden",
    
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
  roomName: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontFamily:"Lexend-Regular"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor:Colors.primary100
  },
  icon: { marginVertical: 8 },
  deviceCount: { fontSize: 14, color: "white", marginTop: 5,fontFamily:"Lexend-Regular" },
  deviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
