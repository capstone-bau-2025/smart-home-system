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

export default function MidModal({
  visible,
  onClose,
  children,cancelLabel,confirmLabel
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


      <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                          <Text style={styles.ButtonText}>{cancelLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={styles.confirmButton}>
                          <Text style={styles.ButtonText}>{confirmLabel}</Text>
                        </TouchableOpacity>
                      </View>
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
    width: 'auto',
    height:'auto'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,


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
  },
  ButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});