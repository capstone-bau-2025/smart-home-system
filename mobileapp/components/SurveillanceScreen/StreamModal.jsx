import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { streamCameraById } from "../../api/services/surveillanceService";
import { Ionicons } from "@expo/vector-icons";

export default function StreamModal({ visible, onClose, camera }) {
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockStreamUrl = "http://webcam01.ecn.purdue.edu/mjpg/video.mjpg";
  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;
  const activeStreamUrl = streamUrl || mockStreamUrl;

  // useEffect(() => {
  //   const fetchStreamUrl = async () => {
  //     if (!camera?.id || !hubSerialNumber) return;
  //     setLoading(true);
  //     try {
  //       const url = await streamCameraById(camera.id, hubSerialNumber);
  //       setStreamUrl(url);
  //     } catch (err) {
  //       console.error("Failed to fetch stream URL:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStreamUrl();
  // }, [camera, hubSerialNumber]);

  if (!camera) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="videocam-outline" size={24} color="#ff7728" />
            <Text style={styles.title}>{camera?.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Metadata */}
          <View style={styles.metaRow}>
            <Text
              style={[
                styles.metaText,
                camera.status === "CONNECTED"
                  ? styles.connected
                  : styles.disconnected,
              ]}
            >
              {camera.status === "CONNECTED" ? "Connected" : "Disconnected"}
            </Text>
            <Text style={styles.metaText}>
              {camera.type} • {camera.modelName}
            </Text>
          </View>

          {/* Stream */}
          <View style={styles.streamContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF7B00" />
            ) : (
              <WebView
                style={styles.webview}
                originWhitelist={["*"]}
                source={{ uri: activeStreamUrl }}
                javaScriptEnabled
                domStorageEnabled
                onError={(err) =>
                  console.error("WebView MJPEG error:", err.nativeEvent)
                }
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    fontFamily: "Lexend-Regular",
  },
  metaRow: {
    alignItems: "center",
    marginBottom: 10,
  },
  metaText: {
    fontSize: 13,
    marginBottom: 2,
    color: "#666",
  },
  connected: {
    color: "#28a745",
    fontSize:15
  },
  disconnected: {
    color: "#dc3545", 
      fontSize:15
  },
  streamContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#000",
    overflow: "hidden",
    
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
});
