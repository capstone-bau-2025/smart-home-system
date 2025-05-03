import { StyleSheet, View,Platform,StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import HubInfoModal from "../../components/HomeScreen/HubInfoModal";
import Colors from "../../constants/Colors";
import Home from "../../components/HomeScreen/Home";
import useInitAppData from "../../hooks/useInitAppData";
import useAreas from "../../hooks/useAreas";
import { getActiveBaseUrl } from "../../util/auth";
import { fetchAreas } from "../../api/services/areaService";
export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    (async () => {
      await getActiveBaseUrl();
    })();
  }, []);

  useInitAppData();
  
  const { areas} = useAreas('123456789');
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    setRooms(areas);
    console.log(areas)
  }, [areas]);


  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const { data } = await fetchAreas('123456789');
      setRooms(data);
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
      <TopRightBlob />
      <Header setModalVisible={setModalVisible} />
      <HubInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Home data={rooms} onRefresh={handleRefresh}   refreshing={refreshing}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "android" ? 10: 0,
  },
});
