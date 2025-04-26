import React, { Children } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//a component that renders a small modal in the middle of the screen (can be used as a wrapper)
export default function MidModal({
  visible,
  onClose,
  children,cancelLabel,confirmLabel,
  buttons
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
    
      <View style={styles.modalContainer}>{children}

{buttons &&
      <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                          <Text style={styles.ButtonText}>{cancelLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.confirmButton}>
                          <Text style={styles.ButtonText}>{confirmLabel}</Text>
                        </TouchableOpacity>
                      </View>
                      }
      </View>
      
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 'auto',
    height:'auto'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,

    width: 100,
    marginHorizontal: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: 40,
    marginHorizontal: 10,
    alignItems: "center",
    width: 100,
  },
  ButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily:"Lexend-Regular",
  },
});