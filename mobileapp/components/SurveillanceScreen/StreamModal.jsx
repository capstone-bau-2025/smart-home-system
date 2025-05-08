import { StyleSheet, Text, View, ActivityIndicator, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import FullScreenModal from "../UI/FullScreenModal";
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

  // Optional: uncomment when backend is ready
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
    <FullScreenModal visible={visible} onClose={onClose}>
  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',}}>
    <Ionicons name="videocam-outline" size={36} color="#ff7728" style={{marginRight:10}}/>
        <Text style={styles.title}>{camera?.name || "Camera Stream"}</Text>
  </View>
      <View style={styles.streamContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF7B00" />
        ) : (
          <WebView
            style={styles.webview}
            originWhitelist={["*"]}
            source={{
              uri: activeStreamUrl,
            }}
            javaScriptEnabled
            domStorageEnabled
            onError={(err) =>
              console.error("WebView MJPEG error:", err.nativeEvent)
            }
          />
        )}
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    
    padding: 10,
    color: "#333",
    textAlign: "center",
    fontFamily:'Lexend-Regular'
  },
  streamContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  webview: {
    
    aspectRatio: Platform.OS === "android" ? 4/3: 1/2,
  
    backgroundColor: "#000",
  },
  error: {
    color: "red",
    padding: 20,
  },
});
