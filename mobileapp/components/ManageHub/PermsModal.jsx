import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message"; 

//opens a modal that makes it possible to change the permissions of a user
export default function PermsModal({ visible, onClose, userId, users, updatePermissions }) {
  const selectedUser = users.find((user) => user.id === userId);
  const [userPerms, setUserPerms] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setUserPerms(selectedUser.perms || {});
    }
  }, [selectedUser]);

  const togglePermission = (room) => {
    setUserPerms((prev) => ({
      ...prev,
      [room]: !prev[room],
    }));
  };

  const handleSave = () => {
    updatePermissions(userId, userPerms);

    Toast.show({
      type: "success",
      text1: "Permissions Updated",
      text2: `${selectedUser?.name}'s permissions have been saved.`,
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 60,
    });

    onClose();
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
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

  

    </>
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
    height: 600,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 500,
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
    backgroundColor: "#4CAF50",
  },
  denied: {
    backgroundColor: "#FF3B30",
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
