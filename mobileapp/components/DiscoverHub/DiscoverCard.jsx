import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DiscoveryModal from "./DiscoveryModal";

// Card that shows either discovered hubs or devices based on the "isDevice" prop
export default function DiscoverCard({ hubs, onScanPress, isDevice }) {
  const mockHubs = [
    {
      name: "JQxIu84zxC",
      description: "Setup required",
      discovered: false,
    },
    {
      name: "AxzIu14zxC",
      description: "Invitation needed to connect",
      discovered: true,
    },
    {
      name: "Sa2eIu8zxC",
      description: "Invitation needed to connect",
      discovered: true,
    },
  ];

  const mockDevices = [
    {
      name: "AxzIu14zxC",
      description: " ",
    },
    {
      name: "Sa2eIu8zxC",
      description: " ",
    },
    {
      name: "JQxIu84zxC",
      description: " ",
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const data = isDevice ? mockDevices : mockHubs;

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {data.map((item, index) => (
          <View key={index} style={styles.container}>
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
                {
                  backgroundColor: isDevice
                    ? "#D3D3D3" 
                    : item.discovered
                    ? "#e0ffe0" 
                    : "#ffe0e0", 
                },
              ]}
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}
            >
              <View>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#888"
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <DiscoveryModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        onClose={() => setModalVisible(false)}
        title={
          isDevice
            ? "Device Details"
            : selectedItem?.discovered
            ? "Connect to hub"
            : "Configure Hub"
        }
        selectedHub={selectedItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  descriptionText: {
    fontSize: 14,
    color: "#8a8a8a",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: "90%",
    height: 70,
    borderWidth: 1,
    borderColor: "#c3c3c3",
  },
  container: {
    alignItems: "center",
    width: "100%",
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
