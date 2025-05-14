import React, { useState, useEffect, use } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { updateUserPermissions, userPermsissions } from "../../api/services/userService";
import { setPermissions } from "../../store/slices/userSlice";

export default function PermsModal({
  visible,
  onClose,
  userId,
  users,
  hubSerialNumber,
  userName,
}) {
  const dispatch = useDispatch();

  const selectedUser = users.find((user) => user.id === userId);

  const rooms = useSelector((state) => state.areas.areas);
  const currentHub = useSelector((state) => state.hub.currentHub);
  const currentUserRole = currentHub?.role;
  const [userPerms, setUserPerms] = useState({});
  const isAdmin = selectedUser?.role === "ADMIN";
  const isNotAdmin = currentUserRole !== "ADMIN";
  const isLocked = isAdmin || isNotAdmin;

  const togglePermission = (roomId) => {
    const id = String(roomId);
    setUserPerms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = async () => {
    try {
      const allowedRoomIds = Object.entries(userPerms)
      .filter(([_, allowed]) => allowed)
      .map(([roomId]) => parseInt(roomId));

    
    await updateUserPermissions(userId, allowedRoomIds, hubSerialNumber);


      Toast.show({
        type: "success",
        text1: "Permissions Updated",
        text2: `Permissions have been updated.`,
        position: "top",
        autoHide: true,
        topOffset: 60,
      });

      onClose();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to update permissions",
        text2: err.message || "Unknown error",
        position: "top",
      });
    }
  };

  useEffect(() => {
    const initPerms = async () => {
      if (!userId || !hubSerialNumber || rooms.length === 0) return;
  
      try {
        const res = await userPermsissions(userId, hubSerialNumber);
        const allowedRoomIds = res || [];

        const initialPerms = {};
        rooms.forEach((room) => {
          initialPerms[String(room.id)] = allowedRoomIds.includes(room.id);
        });
  
        setUserPerms(initialPerms);
      } catch (err) {
        console.error("Error fetching permissions:", err);
      }
    };
  
    if (visible) {
      initPerms();
    }
  }, [userId, hubSerialNumber, rooms, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>{userName?.split("@")[0]}'s Permissions</Text>

              {isLocked && (
                <Text style={styles.lockedText}>You can't edit these permissions.</Text>
              )}

              <ScrollView style={styles.scrollContainer}>
                {rooms.map((room) => {
                  const access = userPerms[String(room.id)] ?? false;

                  return (
                    <View key={room.id} style={styles.permItem}>
                      <Text style={styles.roomText}>{room.name}</Text>
                      <TouchableOpacity
                        disabled={isLocked}
                        style={[
                          styles.toggleButton,
                          isLocked
                            ? styles.disabled
                            : access
                            ? styles.allowed
                            : styles.denied,
                        ]}
                        onPress={() => togglePermission(room.id)}
                      >
                        <Text style={styles.toggleButtonText}>
                          {isLocked
                            ? "🔒 Locked"
                            : access
                            ? "✅ Allowed"
                            : "❌ Denied"}
                        </Text>
                        
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                  disabled={isLocked}
                >
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
    height: 600,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  lockedText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 10,
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 500,
  },
  permItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  roomText: {
    fontSize: 18,
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
  disabled: {
    backgroundColor: "#ccc",
  },
  toggleButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
