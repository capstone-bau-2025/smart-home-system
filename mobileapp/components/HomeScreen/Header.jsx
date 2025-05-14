import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import HubDropdown from "./HubDropdown";
import HeaderIcons from "../UI/HeaderIcons";
import AddDropdown from "./AddDropdown";
import SettingsDropdown from "./SettingsDropdown";
import { useDispatch, useSelector } from "react-redux";

//renders header elements in the homescreen
export default function Header({ setModalVisible,  }) {
  const [addValue, setAddValue] = useState(null);
  const [settingsValue, setSettingsValue] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const currentHub = useSelector((state) => state.hub.currentHub);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <HubDropdown
        currentHub={currentHub}
        userHubs={userHubs}
      />


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
