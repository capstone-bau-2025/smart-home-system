import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RemoveUser({ visible, onClose, userId }) {
  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="fade"
      hideModalContentWhileAnimating={true}
      onRequestClose={onClose} 
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalContainer}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle-outline" size={50} color="white" />
              </View>
              <Text style={styles.title}>Remove User</Text>
              <Text>Are you sure you want to remove this user?</Text>
      <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Yes</Text>
                </TouchableOpacity>
      </View>
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
    backgroundColor: "red",
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
    width: 70,
    height: 40,
    marginHorizontal:10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

  },
});