import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import HubDropdown from "./HubDropdown";
import HeaderIcons from "../UI/HeaderIcons";
import AddDropdown from "./AddDropdown";
import SettingsDropdown from "./SettingsDropdown";
import { useDispatch, useSelector } from "react-redux";
import InfoModal from "../UI/InfoModal";
//renders header elements in the homescreen
export default function Header({ setModalVisible, modalVisible }) {
  const [addValue, setAddValue] = useState(null);
  const [settingsValue, setSettingsValue] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const currentHub = useSelector((state) => state.hub.currentHub);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const noHub = userHubs.length === 0;
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <HubDropdown currentHub={currentHub} userHubs={userHubs} noHub={noHub} />

      <HeaderIcons
        onInfoPress={() => setModalVisible(true)}
        onAddPress={() => setAddVisible((prev) => !prev)}
        onCogPress={() => setSettingsVisible((prev) => !prev)}
      />

      <AddDropdown
        addValue={addValue}
        setAddValue={setAddValue}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
      />

      <SettingsDropdown
        settingsValue={settingsValue}
        setSettingsValue={setSettingsValue}
        settingsVisible={settingsVisible}
        setSettingsVisible={setSettingsVisible}
      />

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={"Homescreen"}
  message={
  "This is the Home screen. Tap the + icon to add devices and hubs. Use the cog icon to manage users, settings, and move devices between rooms. Tap on a device card to interact with it. Long press a card to view details or rename the interaction."
}

        iconName={"home-outline"}
        iconColor={"#ff8624db"}
        cancelLabel={"Ok"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    position: "relative",
  },
});
