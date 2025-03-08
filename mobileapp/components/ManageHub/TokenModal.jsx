import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,

  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function TokenModal({ visible, onClose }) {
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Function to copy invite code
  const copyToClipboard = () => {
    Clipboard.setStringAsync("codebasedonrole");
    Alert.alert("Copied!", "Invite code copied to clipboard.");
  };

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
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>

              {/* Invite Code Section */}
              <Text style={styles.title}>Invite Code</Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.codeContainer}>
                <Text style={styles.inviteCode}>codebasedonrole</Text>
                <Ionicons name="copy-outline" size={20} color="#FFA500" />
              </TouchableOpacity>

              {/* Role Selection Buttons */}
              <Text style={styles.subtitle}>Select Role:</Text>
              <View style={styles.roleButtonsContainer}>
                {["Admin", "User", "Guest"].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      selectedRole === role && styles.selectedRoleButton
                    ]}
                    onPress={() => setSelectedRole(role)}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        selectedRole === role && styles.selectedRoleButtonText
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Close Button */}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginVertical: 10,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  inviteCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#555",
  },
  roleButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#ddd",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedRoleButton: {
    backgroundColor: "#FFA500",
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedRoleButtonText: {
    color: "white",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

