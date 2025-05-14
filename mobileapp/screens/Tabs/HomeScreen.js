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

  const loadDevices = useCallback(async () => {
    if (!hubSerialNumber || !areas.length) return;

    try {
      const interactionsByArea = await fetchAllInteractions();

      const metaPerArea = await Promise.all(
        interactionsByArea.map((area) =>
          getDeviceByArea(area.areaId, hubSerialNumber).then((list) => ({
            areaId: area.areaId,
            list,
          }))
        )
      );

      const metaMap = {};
      metaPerArea.forEach(({ list }) => {
        list.forEach((meta) => {
          metaMap[meta.id] = meta;
        });
      });

      const enrichedDevices = interactionsByArea.flatMap((area) => {
        const grouped = {};

        area.interactions.forEach((interaction) => {
          const id = interaction.deviceId;
          if (!grouped[id]) {
            const meta = metaMap[id] || {};
            grouped[id] = {
              uid: `${id}`,
              id,
              areaId: area.areaId,
              areaName: area.areaName,
              name: meta.name ?? interaction.name.split(".")[0],
              model: meta.model,
              description: meta.description,
              category: interaction.category,
              interactions: [],
            };
          }
          grouped[id].interactions.push(interaction);
        });

        return Object.values(grouped);
      });

      dispatch(setDevices(enrichedDevices));
    } catch (err) {
      console.warn("Error loading devices:", err);
    }
  }, [hubSerialNumber, areas, dispatch]);

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
