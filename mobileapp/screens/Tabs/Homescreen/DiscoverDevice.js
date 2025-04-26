import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function DiscoverDevice() {
  const [devices] = useState([
    "Smart Bulb",
    "Thermostat",
    "Smart Plug",
    "Security Camera",
    "Motion Sensor",
    "Smart Lock",
  ]);

  const handleScanDevices = () => {
    console.log("Scanning for devices...");

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discovered Devices</Text>

      {/* Scrollable Device List */}
      <ScrollView contentContainerStyle={styles.deviceList}>
        {devices.map((device, index) => (
          <View key={index} style={styles.deviceItem}>
            <Text style={styles.deviceText}>{device}</Text>
          </View>
        ))}
      </ScrollView>

      {/*  Scan Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScanDevices}>
        <Text style={styles.scanButtonText}>Scan Devices</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  deviceList: {
    paddingBottom: 20,
  },
  deviceItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deviceText: {
    fontSize: 18,
    color: "#333",
  },
  scanButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#2F80ED",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
