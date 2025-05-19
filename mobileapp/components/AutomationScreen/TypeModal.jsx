import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TypeModal({ visible, setVisible, onSelect, selectedType, selectedTime, setSelectedTime, setSelectedType }) {
  const options = [
    {
      label: "Schedule",
      value: "Schedule",
      icon: "alarm-sharp",
      bg: "#eaffea",
      color: "#3e914f",
    },
    {
      label: "Event",
      value: "Event",
      icon: "eye-sharp",
      bg: "#e3f0ff",
      color: "#2f5fa3",
    },
    {
      label: "StatusChange",
      value: "Device Status Change",
      icon: "bulb-sharp",
      bg: "#efe3ff",
      color: "#6a11cb",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Type</Text>

            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  onSelect(option.label);
                  setVisible(false);
                }}
              >
                <View style={[styles.iconWrapper, { backgroundColor: option.bg }]}>
                  <Ionicons name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={styles.optionText}>{option.value}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ccc",
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",

  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff5c5c",
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
