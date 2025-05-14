import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import CustomSlider from "./CustomSlider";
import { Ionicons } from "@expo/vector-icons";

export default function DeviceModal({ visible, onClose, device }) {
  if (!device) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{device.name}</Text>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </Pressable>
              </View>

              {/* Interaction Scroll */}
              <ScrollView style={styles.scrollContainer}>
                {device.interactions.map((interaction, index) => {
                  const { type, name, value, min, max, choices } = interaction;

                  if (type === "INFO") {
                    return (
                      <View key={index} style={styles.item}>
                        <Text style={styles.label}>{name}</Text>
                        <Text style={styles.value}>{value}</Text>
                      </View>
                    );
                  }

                  if (type === "CHOICE" && choices?.length === 2) {
                    return (
                      <Pressable
                        key={index}
                        style={styles.item}
                        onPress={() =>
                          console.log(`Toggle ${name} from ${value}`)
                        }
                      >
                        <Text style={styles.label}>{name}</Text>
                        <Text style={styles.value}>{value}</Text>
                      </Pressable>
                    );
                  }

                  if (type === "CHOICE" && choices?.length > 2) {
                    return (
                      <View key={index} style={styles.item}>
                        <Text style={styles.label}>{name}</Text>
                        <CustomSlider
                          levels={choices}
                          value={choices.indexOf(value)}
                          setValue={(v) => console.log("Set enum", v)}
                        />
                      </View>
                    );
                  }

                  if (type === "RANGE") {
                    return (
                      <View key={index} style={styles.item}>
                        <Text style={styles.label}>{name}</Text>
                        <CustomSlider
                          ranged
                          value={parseFloat(value)}
                          setValue={(v) => console.log("Set range", v)}
                          minRange={parseFloat(min)}
                          maxRange={parseFloat(max)}
                        />
                      </View>
                    );
                  }

                  if (type === "COMMAND") {
                    return (
                      <Pressable
                        key={index}
                        style={styles.commandBtn}
                        onPress={() =>
                          console.log("Trigger command:", interaction.name)
                        }
                      >
                        <Text style={styles.commandText}>
                          {interaction.name}
                        </Text>
                      </Pressable>
                    );
                  }

                  return null;
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    height: "55%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
  },
  scrollContainer: {
    width: "100%",
    maxHeight: "80%",
  },
  item: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Lexend-Regular",
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontFamily: "Lexend-Medium",
  },
  commandBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  commandText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Lexend-Regular",
    fontSize: 14,
  },
});
