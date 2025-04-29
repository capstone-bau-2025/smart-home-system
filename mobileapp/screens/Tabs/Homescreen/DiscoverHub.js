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
import DiscoverCard from "../../../components/DiscoverHub/DiscoverCard";
import { fetchHubs } from "../../../api/services/hubService";

export default function DiscoverHub() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serialNumber, setSerialNumber] = useState(null);

  const loadHubs = async () => {
    setLoading(true);
    const { data, error } = await fetchHubs();
    if (error) {
      console.log("Error fetching hubs");
    } else {
      if (Array.isArray(data)) {
        setHubs(data);
      } else if (data) {
        setHubs([data]);
      } else {
        setHubs([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHubs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <>
          <Text style={styles.title}>Looking for hubs...</Text>
          <ActivityIndicator size="large" color="#e19b19" />
        </>
      ) : (
        <>
          <Text style={styles.title}>Scanned Hubs</Text>
          <DiscoverCard
            hubs={hubs}
            isDevice={false}
            serialNumber={serialNumber}
            setSerialNumber={setSerialNumber}
          />
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={loadHubs}
          >
            <Text style={styles.buttonText}>Look for hubs</Text>
          </Pressable>
        </>
      )}
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
