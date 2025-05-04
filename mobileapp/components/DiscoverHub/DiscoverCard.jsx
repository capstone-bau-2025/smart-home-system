import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DiscoveryModal from "./DiscoveryModal";
// Card that shows either discovered hubs or devices based on the 
export default function DiscoverCard({ hubs, onScanPress, isDevice }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {hubs.map((item, index) => {
          const isConfigured = item.status && item.status !== "SETUP";

          return (
            <View key={index} style={styles.container}>
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.pressed,
                  {
                    backgroundColor: isDevice
                      ? "#D3D3D3"
                      : isConfigured
                      ? "#e0ffe0"
                      : "#ffe0e0",
                  },
                ]}
                onPress={() => handlePress(item)}
              >
                <View>
                  <Text style={styles.nameText}>{item.name}</Text>
                  <Text style={styles.descriptionText}>
                    {isConfigured
                      ? "Invitation code needed to connect"
                      : "Setup required"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#888"
                />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <DiscoveryModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        onClose={() => setModalVisible(false)}
        title={
          isDevice
            ? "Device Details"
            : selectedItem?.status && selectedItem.status !== "SETUP"
            ? "Connect to Hub"
            : "Configure Hub"
        }
        selectedHub={selectedItem}
        isConfigured={selectedItem?.status && selectedItem.status !== "SETUP"}
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
});
