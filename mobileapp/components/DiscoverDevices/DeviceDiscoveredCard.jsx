import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DeviceDiscoveredModal from "./DeviceDiscoveredModal"; 
import { useSelector } from "react-redux";

export default function DeviceDiscoveredCard({ data }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);


  
  const handlePress = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
    console.log("Selected device:", device?.uid);
  };


  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {Object.values(data).map((device) => (
          <View key={device.uid} style={styles.container}>
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
              ]}
              onPress={() => handlePress(device)}
            >
              <View>
                <Text style={styles.nameText}>{device?.model}</Text>
                <Text style={styles.descriptionText}>
               {device?.type}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#8a8a8a"
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>

  <DeviceDiscoveredModal  visible={modalVisible} onClose={() =>setModalVisible(false)} selectedDevice={selectedDevice} title={selectedDevice?.name ?? "Device Details"}/>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ecdbb5", 
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: "95%",
    height: 70,
    borderWidth: 1,
    borderColor: "#f0a500", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
  },
  pressed: {
    opacity: 0.7,
  },
});
