import { StyleSheet, View, Platform, StatusBar,Text } from "react-native";
import React, { useState, useEffect, } from "react";
import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import HubInfoModal from "../../components/HomeScreen/HubInfoModal";
import Colors from "../../constants/Colors";
import Home from "../../components/HomeScreen/Home";
import useInitAppData from "../../hooks/useInitAppData";
import useAreas from "../../hooks/useAreas";
import { getActiveBaseUrl, startActiveUrlMonitor } from "../../util/auth";
import { fetchAreas } from "../../api/services/areaService";
import { useDispatch, useSelector } from "react-redux";
import { setUserHubs, setCurrentHub } from "../../store/slices/hubSlice";
import { fetchUserDetails } from "../../api/services/userService";
import { setUrl } from "../../store/slices/urlSlice";
import { setAreas } from "../../store/slices/areaSlice";
import { getDeviceByArea } from "../../api/services/deviceService";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const currentHub = useSelector((state) => state.hub.currentHub);
  const hubSerialNumber = currentHub?.serialNumber;
  const currentUrl = useSelector((state) => state.url.currentUrl);

  // useEffect(() => {
  //   startActiveUrlMonitor((newUrl) => {
  //     dispatch(setUrl(newUrl));
  //     console.log("🌐 ACTIVE_URL updated to:", newUrl);
  //   });
  
  
  //   (async () => {
  //     try {
  //       const initialUrl = await getActiveBaseUrl();
  //       dispatch(setUrl(initialUrl));
  //     } catch (err) {
  //       console.error("Failed to set initial active URL:", err.message);
  //     }
  //   })();
  // }, []);

  useInitAppData(); //fetch user details and hubs on app load to set redux state

  useEffect(() => {
    if (!hubSerialNumber) return;
  
    (async () => {
      try {
        const devices = await getDeviceByArea(1, hubSerialNumber);
        console.log("Devices in room 1:", devices);
      } catch (err) {
        console.warn("Error fetching devices:", err?.response?.data || err.message || err);
      }
    })();
  }, [hubSerialNumber]);

  const { areas } = useAreas(hubSerialNumber);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setRooms(areas);
    dispatch(setAreas(areas));

    console.log(areas);
  }, [areas]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const { data } = await fetchAreas(hubSerialNumber);
      setRooms(data);

      const userData = await fetchUserDetails();
      dispatch(setUserHubs(userData.hubsConnected));
      dispatch(
        setCurrentHub(
          userData.hubsConnected.find(
            (h) => h.serialNumber === hubSerialNumber
          ) || null
        )
      );
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
