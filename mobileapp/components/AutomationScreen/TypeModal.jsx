import { StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TypeModal({ visible, setVisible, onSelect, selectedType,  }) {
  const options = [
    { label: "Schedule",value: "Schedule" , icon: "alarm-sharp", gradient: ["#14f423", "#9fc464"] },
    { label: "Trigger", value: "Device Trigger", icon: "eye-sharp", gradient: ["#56CCF2", "#2F80ED"] },
    { label: "StatusChange",value: "Device Status Change" , icon: "bulb-sharp", gradient: ["#6a11cb", "#2575fc"] },
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
                <LinearGradient colors={option.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientIcon}>
                  <Ionicons name={option.icon} size={24} color="white" />
                </LinearGradient>
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
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  gradientIcon: {
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
