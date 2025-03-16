import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import HubInfoModal from "../../components/HomeScreen/HubInfoModal";

export default function HomeScreen({setCurrentHub, currentHub}) {
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <SafeAreaView style={styles.container}>
      <TopRightBlob />
      <Header setModalVisible={setModalVisible} setCurrentHub={setCurrentHub} currentHub={currentHub}/>
      <HubInfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
/*Settings
Manage (Hub)change (Changing hub name + adding users generating tokem based role)
Manage Devices (Managing devices + rooms) expandable lists for rooms
*/

/*Add
Add Device
Add hub
*/

/* Info
-Connected locally or remotely

*/