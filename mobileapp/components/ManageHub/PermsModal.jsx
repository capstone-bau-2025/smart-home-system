import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";

export default function PermsModal({ visible, onClose, userId, users, updatePermissions }) {
  // Find the selected user
  const selectedUser = users.find((user) => user.id === userId);

  // Local state to track changes
  const [userPerms, setUserPerms] = useState(selectedUser?.perms || {});

  // Update local permissions when user changes
  useEffect(() => {
    if (selectedUser) {
      setUserPerms(selectedUser.perms);
    }
  }, [selectedUser]);

  // Function to toggle permission
  const togglePermission = (room) => {
    setUserPerms((prev) => ({
      ...prev,
      [room]: !prev[room], // Toggle true/false
    }));
  };

  // Save changes and close
  const handleSave = () => {
    updatePermissions(userId, userPerms);
    Alert.alert("Permissions Updated", "User permissions have been updated.");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      hideModalContentWhileAnimating={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{selectedUser?.name}'s Permissions</Text>

              <ScrollView style={styles.scrollContainer}>
                {selectedUser?.perms ? (
                  Object.entries(userPerms).map(([room, access]) => (
                    <View key={room} style={styles.permItem}>
                      <Text style={styles.roomText}>{room}</Text>

                      {/* Toggle Button */}
                      <TouchableOpacity
                        style={[styles.toggleButton, access ? styles.allowed : styles.denied]}
                        onPress={() => togglePermission(room)}
                      >
                        <Text style={styles.toggleButtonText}>
                          {access ? "✅ Allowed" : "❌ Denied"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noPerms}>No permissions found.</Text>
                )}
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
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
    height:600
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 600,
  },
  permItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    
  },
  roomText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  allowed: {
    backgroundColor: "#4CAF50", // Green
  },
  denied: {
    backgroundColor: "#FF3B30", // Red
  },
  toggleButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  noPerms: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
