import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import EditInput from "../UI/EditInput";

export default function DeviceModal({ visible, onClose, device }) {
  const storedDevices = useSelector((state) => state.devices?.devices);
  const selectedDevice = storedDevices?.find((d) => d.id === device.deviceId);

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
              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Device Title */}
                <Text style={styles.deviceTitle}>
                  {selectedDevice?.name ?? "Unnamed Device"}
                </Text>

                {/* Input Section */}
                <View style={styles.inputBlock}>
                  <Text style={styles.inputLabel}>
                    Rename current interaction
                  </Text>
                  <EditInput placeholder="Enter new name" />
                  <Pressable style={styles.confirmBtn}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </Pressable>
                </View>

                {/* Metadata Row 1 */}
                <View style={styles.metadataRow}>
                  <View style={styles.metadataBlock}>
                    <Text style={styles.metaLabel}>Interaction Name</Text>
                    <Text style={styles.metaValue}>
                      {device?.name ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.metadataBlock}>
                    <Text style={styles.metaLabel}>Status</Text>
                    <Text
                      style={[
                        styles.metaValue,
                        selectedDevice?.status === "CONNECTED"
                          ? styles.connected
                          : styles.disconnected,
                      ]}
                    >
                      {selectedDevice?.status ?? "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Metadata Row 2 */}
                <View style={styles.metadataRow}>
                  <View style={styles.metadataBlock}>
                    <Text style={styles.metaLabel}>Type</Text>
                    <Text style={styles.metaValue}>
                      {device?.type ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.metadataBlock}>
                    <Text style={styles.metaLabel}>Area</Text>
                    <Text style={styles.metaValue}>
                      {selectedDevice?.areaName ?? "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Metadata Row 3 */}
                <View style={styles.metadataRow}>
                  <View style={styles.metadataBlock}>
                    <Text style={styles.metaLabel}>Last Seen</Text>
                    <Text style={styles.metaValue}>
                      {selectedDevice?.lastSeen?.split("T")[0] ?? "N/A"}
                    </Text>
                  </View>
                  <View style={styles.metadataBlock}>
                    <Text style={styles.metaLabel}>Model</Text>
                    <Text style={styles.metaValue}>
                      {selectedDevice?.model ?? "N/A"}
                    </Text>
                  </View>
                </View>
              </ScrollView>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    height: "55%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  scrollContainer: {
    width: "100%",
    maxHeight: "100%",
  },
  deviceTitle: {
    fontSize: 22,
    fontFamily: "Lexend-Bold",
    textAlign: "center",
    marginBottom: 16,
  },
  inputBlock: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    color: "#000000",
    
  },
  confirmBtn: {
    backgroundColor: "#fe9123",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    width:200,
    alignSelf: "center",
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Lexend-Regular",
    fontSize: 20,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 420,
    marginBottom: 12,
  },
  metadataBlock: {
    flex: 1,
    paddingHorizontal: 6,
  },
  metaLabel: {
    fontSize: 20,
    fontFamily: "Lexend-Regular",
    color: "#777",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 15,
    fontFamily: "Lexend-Medium",
    color: "#000",
  },
  connected: {
    color: "#27ae60",
  },
  disconnected: {
    color: "#e74c3c",
  },
});
