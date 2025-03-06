import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import HubDropdown from "./HubDropdown";
import HeaderIcons from "./HeaderIcons";
import AddDropdown from "./AddDropdown";
import SettingsDropdown from "./SettingsDropdown";

export default function Header({ setModalVisible }) {
  const [selectedHub, setselectedHub] = useState("Hub1");
  const [addValue, setAddValue] = useState(null);
  const [settingsValue, setSettingsValue] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [shouldRenderSettings, setShouldRenderSettings] = useState(false);

  // Handle settings modal visibility with delayed unmounting
  useEffect(() => {
    if (settingsVisible) {
      setShouldRenderSettings(true);
    } else {
      setTimeout(() => setShouldRenderSettings(false), 1); // Delay unmounting to prevent flickering
    }
  }, [settingsVisible]);

  return (
    <View style={styles.container}>
      <HubDropdown selectedHub={selectedHub} setselectedHub={setselectedHub} />

      {/* Icons with press handlers */}
      <HeaderIcons
        onInfoPress={() => setModalVisible(true)}
        onAddPress={() => setAddVisible((prev) => !prev)}
        onCogPress={() => setSettingsVisible((prev) => !prev)} // Fix flicker issue
      />

      {/* Add dropdown */}
      <AddDropdown
        addValue={addValue}
        setAddValue={setAddValue}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
      />

      {/* Settings dropdown with smooth close effect */}
      {shouldRenderSettings && (
        <SettingsDropdown
          settingsValue={settingsValue}
          setSettingsValue={setSettingsValue}
          settingsVisible={settingsVisible}
          setSettingsVisible={setSettingsVisible}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 27,
    paddingVertical: 10,
    position: "relative",
  },
});
