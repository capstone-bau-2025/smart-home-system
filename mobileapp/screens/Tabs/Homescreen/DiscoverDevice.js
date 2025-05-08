import {
  Modal,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { discoverDevices } from "../../../api/services/deviceDiscoverService";
import { discoveredDevices } from "../../../Data/discoveredDevices";
import DeviceDiscoveredCard from "../../../components/DiscoverDevices/DeviceDiscoveredCard";

export default function DiscoverDevice() {
  const currentHub = useSelector((state) => state.hub.currentHub);
  // const [devices, setDevices] = useState(discoveredDevices);
  const [loading, setLoading] = useState(false);

  // const fetchDevices = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await discoverDevices();
  //     setDevices(res);
  //     console.log("DEVICES DISCOVERED:", res);
  //   } catch (err) {
  //     console.error("Failed to discover devices:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   setDevices(discoveredDevices);
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <>
          <Text style={styles.title}>Looking for devices...</Text>
          <ActivityIndicator size="large" color="#e19b19" />
        </>
      ) : (
        <>
          <Text style={styles.title}>Scanned Devices</Text>
          <DeviceDiscoveredCard data={discoveredDevices} />
        </>
      )}

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={console.log('"Discovering devices...")}')}
      >
        <Text style={styles.buttonText}>Look for devices</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    color: "#000000",
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  button: {
    padding: 10,
    backgroundColor: "#e19b19",
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
