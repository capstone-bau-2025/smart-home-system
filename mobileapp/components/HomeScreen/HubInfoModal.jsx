import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HubInfoModal({ visible, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle-outline" size={50} color="black" />
              </View>

              <Text style={styles.title}>
                Hub Name: <Text style={styles.value}>Home</Text>
              </Text>
              <Text style={styles.title}>
                Hub ID: <Text style={styles.value}>21ba92</Text>
              </Text>
              <Text style={styles.title}>
                Users Count: <Text style={styles.value}>4 (2 Admins)</Text>
              </Text>
              <Text style={styles.title}>
                Devices: <Text style={styles.value}>12</Text>
              </Text>
              <Text style={styles.title}>
                Cameras: <Text style={styles.value}>3</Text>
              </Text>
              <Text style={styles.title}>
                Date Added: <Text style={styles.value}>12.2.24</Text>
              </Text>

              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  infoIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  value: {
    fontWeight: "bold",
    color: "#666",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
