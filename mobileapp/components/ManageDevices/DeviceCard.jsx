import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function DeviceCard({ device, onPress }) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#e19b19", "#ffae75"]} // Gold to Orange Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Ionicons name="repeat-outline" size={20} style={styles.icon} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.7, 
  },
  container: {
    padding: 14,
    margin: 7,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between", 
  },
  deviceName: {
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    color: "white",
  },
});
