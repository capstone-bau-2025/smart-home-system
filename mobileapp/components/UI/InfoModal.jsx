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

//opens a mid screen modal with an icon and a message, and a close button
export default function InfoModal({
  visible,
  onClose,
  iconName = "alert-circle-outline",
  iconColor = "#2d9f99",
  message,
  highlightedText,
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
  title,
  footerText,
  footerTitle,
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
              <View
                style={[styles.iconContainer, { backgroundColor: iconColor }]}
              >
                <Ionicons name={iconName} size={50} color="white" />
              </View>
              <Text style={styles.message}>
                {title && <Text style={styles.title}>{title}</Text>}
              </Text>

              <Text style={styles.message}>
                {message}{" "}
                {highlightedText && (
                  <Text style={styles.highlightedText}>{highlightedText}</Text>
                )}
              </Text>

              {(footerTitle || footerText) && (
                <View style={styles.footerContainer}>
                  {footerTitle && (
                    <Text style={styles.footerTitle}>{footerTitle}</Text>
                  )}
                  {footerText && (
                    <Text style={styles.footerText}>{footerText}</Text>
                  )}
                </View>
              )}
              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>{cancelLabel}</Text>
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
    color: "#2aa8a8",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "auto",
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#2d9f99",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 70,
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontFamily: "Lexend-Bold",
    color: "orange",
    fontSize: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
  marginTop: 15,
  backgroundColor: "#f6f6f6",
  padding: 12,
  borderRadius: 10,
  width: "100%",
},

footerTitle: {
  fontFamily: "Lexend-Bold",
  fontSize: 18,
  color: "orange",
  marginBottom: 5,
  textAlign: "center",
},

footerText: {
  fontFamily: "Lexend-Regular",
  fontSize: 14,
  color: "#333",
  textAlign: "left",
},
});
