import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import HubInfoModal from "../../components/HomeScreen/HubInfoModal";
import Colors from "../../constants/Colors";
import Home from "../../components/HomeScreen/Home";
import useInitAppData from "../../hooks/useInitAppData";
import useAreas from "../../hooks/useAreas";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useInitAppData();
  
  const { areas} = useAreas('123456789');
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    setRooms(areas);
  }, [areas]);

  return (
    <SafeAreaView style={styles.container}>
      <TopRightBlob />
      <Header setModalVisible={setModalVisible} />
      <HubInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Home data={rooms}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
