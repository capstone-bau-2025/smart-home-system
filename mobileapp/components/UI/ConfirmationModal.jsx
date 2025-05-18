import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// a custom modal that takes in a message and an icon, and two buttons (confirm and cancel) to confirm or cancel an action
export default function ConfirmationModal({
  visible,
  onClose,
  iconName = "alert-circle-outline",
  iconColor = "#2d9f99",
  message,
  highlightedText,
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
}) {
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
              <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
                <Ionicons name={iconName} size={50} color="white" />
              </View>

              <Text style={styles.message}>
                {message}{" "}
                {highlightedText && <Text style={styles.highlightedText}>{highlightedText}</Text>}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                  <Text style={styles.closeButtonText}>{confirmLabel}</Text>
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
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    textAlign: "center",
  },
  highlightedText: {
    fontFamily: "Lexend-Bold",
    color: "#ff9831",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#ff0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 70,
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 70,
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 