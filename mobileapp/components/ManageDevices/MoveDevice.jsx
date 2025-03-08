import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function MoveDevice({ onMove }) {
  return (
    <>
    <Pressable 
      style={({ pressed }) => [
        styles.container, 
        pressed && styles.pressedContainer 
      ]}
      onPress={onMove}
    >
      <Text style={styles.moveText}>Move a device to this <Text style={styles.underline}>Room</Text></Text>
      <Ionicons name="swap-horizontal-outline" size={24} style={styles.icon} />
    </Pressable>
    <Text style={styles.info}>Move a device to another room</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
  
  },
  pressedContainer: {
    opacity: 0.7, 
  },
  moveText: {
    fontSize: 18,
    fontWeight: "bold",
     color: "#D18900", 
    marginRight: 8,
    fontFamily:'Lexend-Regular'
  },
  icon: {
    color: "#e19b19",
  },
  underline: {
    textDecorationLine: "underline",
    color: "#2aa8a8",
  },
  info:{
    fontSize: 20,
    color: "#2aa8a8",
    textAlign: "center",
    paddingHorizontal: 12,
    fontFamily:'Lexend-Regular',
    marginVertical:12,
  }
});

