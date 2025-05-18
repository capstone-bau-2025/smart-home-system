import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  FlatList,
  Text,
} from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import StreamModal from "../../components/SurveillanceScreen/StreamModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import InfoModal from "../../components/UI/InfoModal";
import HubsTabs from "../../components/UI/HubsTabs";
import BottomRightBlob from "../../components/svg/BottomRightBlob";
import Colors from "../../constants/Colors";
import { hubs } from "../../Data/Hubs";
import CameraCard from "../../components/SurveillanceScreen/CameraCard";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllCameras } from "../../api/services/surveillanceService";

export default function SurveillanceScreen() {
  const [infoModal, setInfoModal] = useState(false);

  const [streamModalVisible, setStreamModalVisible] = useState(false);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const [selectedTab, setSelectedTab] = useState(userHubs?.[0] ?? null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;

  function handleCameraPress(camera) {
    setSelectedCamera(camera);
    setStreamModalVisible(true);
  }
useEffect(() => {
  if (!hubSerialNumber) return;

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const data = await getAllCameras(hubSerialNumber);
      console.log("Cameras from API:", data);
      setCameras(data);
    } catch (error) {
      console.error("❌ Error fetching cameras:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCameras();
}, [hubSerialNumber]);


  return (
    <SafeAreaView style={styles.container}>
      <BottomRightBlob />

      <View style={styles.bgCamera1}>
        <Ionicons
          name="videocam-outline"
          size={150}
          color="rgba(255,123,0,0.08)"
          style={{ transform: [{ rotate: "-15deg" }] }}
        />
      </View>

      <View style={styles.bgCamera2}>
        <Ionicons
          name="videocam-outline"
          size={120}
          color="rgba(255,123,0,0.06)"
          style={{ transform: [{ rotate: "20deg" }] }}
        />
      </View>

      <View style={styles.bgCamera3}>
        <Ionicons
          name="camera-outline"
          size={120}
          color="rgba(255,123,0,0.06)"
          style={{ transform: [{ rotate: "20deg" }] }}
        />
      </View>
      <View style={styles.bgCircle}>
        <Ionicons
          name="camera-outline"
          size={150}
          color="rgba(255,13,0,0.07)"
          style={{ transform: [{ rotate: "-20deg" }] }}
        />
      </View>

      <View style={styles.cameraBgIcon}>
        <Ionicons
          name="camera-outline"
          size={250}
          color="rgba(0, 0, 0, 0.15)"
        />
      </View>

      <StatusBar barStyle="dark-content"  />

      <View style={styles.header}>
        <HeaderIcons onInfoPress={() => setInfoModal(true)} />
      </View>

      <View style={styles.cardSection}>
        <View style={styles.tabs}>
          <HubsTabs
            hubs={userHubs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>

{loading ? (
  <View style={{ marginTop: 50 }}>
    <Ionicons name="reload-circle" size={40} color="#999" />
  </View>
) : (
  <FlatList
    data={cameras}
    contentContainerStyle={styles.scrollArea}
    numColumns={2}
    renderItem={({ item: camera }) => (
      <CameraCard
        camera={camera}
        onPress={handleCameraPress}
        key={camera.uid}
      />
    )}
    keyExtractor={(item) => item.uid.toString()}
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    ListEmptyComponent={() => 
    (
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <Ionicons name="camera-outline" size={40} color="#999" />
        <Text style={{ color: "#999", marginTop: 10 }}>
          No cameras available
        </Text>
        </View>
    )
    }
  />
)}
      </View>

      <StreamModal
        visible={streamModalVisible}
        onClose={() => setStreamModalVisible(false)}
        camera={selectedCamera}
      />

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message="This is the surveillance screen. You can view and manage your surveillance cameras here. Tap on a camera to view its live feed or access its settings."
        title="Surveillance"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  cameraBgIcon: {
    position: "absolute",
    bottom: -30,
    left: 15,
  },
  bgCamera1: {
    position: "absolute",
    top: 100,
    left: -30,
  },
  bgCamera2: {
    position: "absolute",
    bottom: 180,
    right: 10,
  },
  bgCamera3: {
    position: "absolute",
    bottom: 300,
    right: 300,
  },
  bgCircle: {
    position: "absolute",
    top: 300,
    right: -40,

    alignItems: "center",
    justifyContent: "center",
  },
  cardSection: {
    flex: 1,
  },
  scrollArea: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tabs: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,

    alignItems: "center",
  },
});
