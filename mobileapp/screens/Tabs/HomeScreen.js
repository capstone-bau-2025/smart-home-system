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
import { fetchAreas } from "../../api/services/areaService";
import { fetchUserDetails } from "../../api/services/userService";
import { getDeviceByArea } from "../../api/services/deviceService";
import { fetchAllInteractions } from "../../api/services/interactionService";
import { setUserHubs, setCurrentHub } from "../../store/slices/hubSlice";
import { setAreas } from "../../store/slices/areaSlice";
import { setDevices } from "../../store/slices/devicesSlice";
import Colors from "../../constants/Colors";

export default function HomeScreen() {
  const dispatch = useDispatch();

  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;
  const currentUrl = useSelector((state) => state.url.currentUrl);

  useInitAppData();                       
  const { areas } = useAreas(hubSerialNumber);


  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState([]);

    // useEffect(() => {
    // // Keep Redux in sync with ACTIVE_URL changes from native side
    // startActiveUrlMonitor((newUrl) => {
    //   dispatch(setUrl(newUrl));
    //   console.log("🌐 ACTIVE_URL updated to:", newUrl);
    // });

    // // Set initial ACTIVE_URL on mount
    // (async () => {
    //   try {
    //     const initialUrl = await getActiveBaseUrl();
    //     dispatch(setUrl(initialUrl));
    //   } catch (err) {
    //     console.error("Failed to set initial active URL:", err.message);
    //   }
    // })();
    //   }, []);
  /** ─────────────────────────────────────────────────────────────
   *  Helper: fetch interactions + metadata, merge, dispatch
   * ───────────────────────────────────────────────────────────── */
  const loadDevices = useCallback(async () => {
    if (!hubSerialNumber || !areas.length) return;

    try {
      // 1. Interactions (all controls/values)
      const interactionsByArea = await fetchAllInteractions();

      // 2. Metadata per area (user-defined name, model, etc.)
      const metaPerArea = await Promise.all(
        interactionsByArea.map((area) =>
          getDeviceByArea(area.areaId, hubSerialNumber).then((list) => ({
            areaId: area.areaId,
            list,
          }))
        )
      );

      // 3. Build lookup by device.id  → metadata
      const metaMap = {};
      metaPerArea.forEach(({ list }) => {
        list.forEach((meta) => {
          metaMap[meta.id] = meta;       
        });
      });

      // 4. Group interactions into devices & enrich with meta
      const enrichedDevices = interactionsByArea.flatMap((area) => {
        const grouped = {};

        area.interactions.forEach((inter) => {
          const id = inter.deviceId;
          if (!grouped[id]) {
            const meta = metaMap[id] || {};
            grouped[id] = {
              id,
              uid: meta.uid,
              areaId: area.areaId,
              areaName: area.areaName,
              name: meta.name ?? inter.name.split(".")[0],
              model: meta.model,
              description: meta.description,
              category: inter.category,
              interactions: [],
            };
          }
          grouped[id].interactions.push(inter);
        });

        return Object.values(grouped);
      });

      // 5. Put into Redux
      dispatch(setDevices(enrichedDevices));
    } catch (err) {
      console.warn("Error loading devices:", err);
    }
  }, [hubSerialNumber, areas, dispatch]);


  useEffect(() => {
    setRooms(areas);
    dispatch(setAreas(areas));
  }, [areas, dispatch]);


  useEffect(() => {
    loadDevices();
  }, [loadDevices]);


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
  
      const { data } = await fetchAreas(hubSerialNumber);
      setRooms(data);
      dispatch(setAreas(data));


      const userData = await fetchUserDetails();
      dispatch(setUserHubs(userData.hubsConnected));
      const updatedHub = userData.hubsConnected.find(
        (h) => h.serialNumber === hubSerialNumber
      );
      dispatch(setCurrentHub(updatedHub || currentHub));


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

      <Home
        data={rooms}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
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
