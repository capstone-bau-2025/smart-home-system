import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";

import Home from "../../components/HomeScreen/Home";

import useInitAppData from "../../hooks/useInitAppData";
import useAreas from "../../hooks/useAreas";
import useDevices from "../../hooks/useDevices";

import { setAreas } from "../../store/slices/areaSlice";
import { setInteractions } from "../../store/slices/devicesSlice";
import { fetchAllInteractions } from "../../api/services/interactionService";
import { setUrl } from "../../store/slices/urlSlice";
import { getActiveUrl } from "../../util/auth";
import { startActiveUrlMonitor } from "../../util/auth";
import Colors from "../../constants/Colors";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;
  const currentUrl = useSelector((state) => state.url.currentUrl);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { refetchUserData, isLoadingUserData } = useInitAppData();

  const { areas, refetchAreas } = useAreas(hubSerialNumber);
  const { devices, isLoadingDevices, refetchDevices } = useDevices(
    hubSerialNumber,
    areas
  );

  useEffect(() => {
    if (areas.length) {
      dispatch(setAreas(areas));
      fetchAllInteractions()
        .then((res) => {
          const flatInteractions = res.flatMap((area) =>
            area.interactions.map((i) => ({
              ...i,
              areaId: area.areaId,
              areaName: area.areaName,
            }))
          );
          dispatch(setInteractions(flatInteractions));
        })
        .catch((err) => console.warn("Error loading interactions:", err));
    }
  }, [areas]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchUserData(), await refetchDevices();
      await refetchAreas();
    } catch (err) {
      console.warn("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const startAutoRefetch = () => {
    const interval = setInterval(async () => {
      console.log("Auto-refreshing app data...");
      try {
        // await refetchUserData();
        await refetchDevices();
        await refetchAreas();
        console.log("Refresh complete");
      } catch (err) {
        console.warn("Auto-refresh error:", err);
      }
    }, 60000); //60000 

    return () => clearInterval(interval);
  };

  useEffect(() => {
    const cleanup = startAutoRefetch();
    return cleanup;
  }, []);
  
  useEffect(() => {
    startActiveUrlMonitor((newUrl) => {

      dispatch(setUrl(newUrl));
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TopRightBlob />
      <Header setModalVisible={setModalVisible} modalVisible={modalVisible} />



      <Home data={areas} onRefresh={handleRefresh} refreshing={refreshing} />
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
