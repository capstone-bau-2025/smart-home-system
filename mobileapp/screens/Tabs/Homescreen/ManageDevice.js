import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import HubsTabs from "../../../components/UI/HubsTabs";
import { useState } from "react";
import { hubs } from "../../../Data/Hubs";
import MainRoomList from "../../../components/ManageDevices/MainRoomList";
import HeaderIcons from "../../../components/UI/HeaderIcons";
import InfoModal from "../../../components/UI/InfoModal";
import AddRoomModal from "../../../components/ManageDevices/AddRoomModal";
import useAreas from "../../../hooks/useAreas";
import { useSelector } from "react-redux";
export default function ManageDevice({
 
  setAddModal,
  setCogModal, 
  setInfoModal,
  infoModal,
  addModal,
  cogModal,
}) {
  
  const currentHub = useSelector((state) => state.hub.currentHub);  
  const userHubs = useSelector((state) => state.hub.userHubs);
  const [selectedTab, setSelectedTab] = useState(userHubs[0]); 
  const { areas, isLoading, refetchAreas } = useAreas(selectedTab?.serialNumber);
  
  
  
  const roomCount = areas.length;
  const deviceCount = 0;
  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />


        <HubsTabs
          hubs={userHubs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />


        <MainRoomList
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          areas={areas}
          isLoading={isLoading}
          refetchAreas={refetchAreas}
          roomCount={roomCount}
          deviceCount={deviceCount}
        />

        <InfoModal
          visible={infoModal}
          onClose={() => setInfoModal(false)}
          cancelLabel="Close"
          iconName="help-outline"
          iconColor="orange"
          message={
            "In this screen, you can add a new room or configure an existing one by selecting it"
          }
          title={"Manage Rooms"}
        />

        <AddRoomModal
          visible={addModal}
          onClose={() => setAddModal(false)}
          title={`Add a room in ${selectedTab.name}`}
          refetchAreas={refetchAreas}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0,  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e19b19",
  },
});
