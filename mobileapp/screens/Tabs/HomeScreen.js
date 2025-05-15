import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Platform, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";
import HubInfoModal from "../../components/HomeScreen/HubInfoModal";
import Home from "../../components/HomeScreen/Home";
import useInitAppData from "../../hooks/useInitAppData";
import useAreas from "../../hooks/useAreas";
import { getDeviceByArea } from "../../api/services/deviceService";
import { fetchAllInteractions } from "../../api/services/interactionService";
import { setAreas } from "../../store/slices/areaSlice";
import { setDevices, setInteractions } from "../../store/slices/devicesSlice";
import Colors from "../../constants/Colors";
import useDevices from "../../hooks/useDevices";
import { fetchAndDispatchDevices } from "../../api/services/deviceService";


export default function HomeScreen() {
  const dispatch = useDispatch();

  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;
  const currentUrl = useSelector((state) => state.url.currentUrl);
  const devices = useSelector((state) => state.devices.devices);
  const interactions = useSelector((state) => state.devices.interactions);
  useInitAppData();
  const { areas } = useAreas(hubSerialNumber);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState([]);
  
  const {
    devices: allDevices,
    isLoadingDevices,
    refetchDevices,
  } = useDevices(hubSerialNumber, areas);


  const loadDevices = useCallback(async () => {
    if (!hubSerialNumber || !areas.length) return;
    
    try {
      const interactionsByArea = await fetchAllInteractions();

    const flatInteractions = interactionsByArea.flatMap((area) =>
      area.interactions.map((interaction) => ({
        ...interaction,
        areaId: area.areaId,
        areaName: area.areaName,
      }))
    );

    dispatch(setInteractions(flatInteractions));
  
  } catch (err) {
    console.warn("Error loading interactions:", err);
  }
}, [hubSerialNumber, areas]);

  useEffect(() => {
    if (areas?.length > 0) {
      setRooms(areas);
      dispatch(setAreas(areas));
    }
  }, [areas, dispatch]);
  
  useEffect(() => {
    if (areas.length) loadDevices();
  }, [areas, hubSerialNumber, loadDevices]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDevices();
    } catch (err) {
      console.warn("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <TopRightBlob />
      <Header setModalVisible={setModalVisible} />
      <Text>{currentUrl}</Text>

      <HubInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <Home data={rooms} onRefresh={handleRefresh} refreshing={refreshing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
});
