import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CamerasBg() {
  return (
    <>
      <View style={styles.bgCamera1}>
        <Ionicons name="camera-outline" size={140} color="rgba(255,123,0,0.07)" />
      </View>
      <View style={styles.bgCamera2}>
        <Ionicons name="camera-outline" size={110} color="rgba(88,86,214,0.06)" />
      </View>
      <View style={styles.bgCamera3}>
        <Ionicons name="camera-outline" size={130} color="rgba(100,210,255,0.05)" />
      </View>
      <View style={styles.bgCamera4}>
        <Ionicons name="camera-outline" size={100} color="rgba(90,90,90,0.04)" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bgCamera1: {
    position: "absolute",
    bottom: -30,
    left: 15,
    zIndex: -1,
  },
  bgCamera2: {
    position: "absolute",
    top: 80,
    right: 20,
    zIndex: -1,
  },
  bgCamera3: {
    position: "absolute",
    bottom: 100,
    right: 40,
    zIndex: -1,
  },
  bgCamera4: {
    position: "absolute",
    top: 200,
    left: 30,
    zIndex: -1,
  },
});
