import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import DiscoveryModal from "./DiscoveryModal";
import { useState } from "react";

//card that shows the discovered hubs, and when pressed it shows a modal with the hub details
export default function DiscoverCard() {
  const hubs = [
    {
      name: "JQxIu84zxC",
      description: "Not Discovered, first time setup needed",
      discovered: false,
    },
    {
      name: "AxzIu14zxC",
      description: "Discovered, invitation needed to connect",
      discovered: true,
    },
    {
      name: "Sa2eIu8zxC",
      description: "Discovered, invitation needed to connect",
      discovered: true,
    },

  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  return (
    <>
      <FlatList
        data={hubs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setSelectedHub(item);
                setModalVisible(true);
              }}
            >
              <View
                style={[
                  styles.card,
                  { backgroundColor: item.discovered ? "#e0ffe0" : "#ffe0e0" },
                ]}
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
              </View>
            </Pressable>
            <DiscoveryModal
              visible={modalVisible}
              setModalVisible={setModalVisible}
              onClose={() => setModalVisible(false)}
              title={
                selectedHub?.discovered ? "Connect to hub" : "Configure Hub"
              }
              selectedHub={selectedHub}
            />
          </>
        )}
        ListFooterComponent={() => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom:25
            }}
          >
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
              onPress={() => console.log("Scan hubs")}
            >
              <Text style={styles.buttonText}>Look for hubs</Text>
            </Pressable>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
