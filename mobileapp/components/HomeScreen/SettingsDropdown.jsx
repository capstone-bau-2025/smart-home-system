import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SettingsDropdown({ settingsValue,setSettingsValue,settingsVisible, setSettingsVisible }) {
  const navigation = useNavigation();

  const addData = [
    { label: "Manage Hub", value: "MHub", icon: "tv-outline" },
    { label: "Manage Devices", value: "MDevices", icon: "cube-outline" },
  ];


  useEffect(() => {
    if (settingsValue === "MDevices") {
      navigation.navigate("ManageDevice"); 
      setSettingsValue(null); 
    } else if (settingsValue === "MHub") {
      navigation.navigate("ManageHub"); 
      setSettingsValue(null);
    }
  }, [settingsValue, navigation]); 

  return (
    <Modal visible={settingsVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.dropdownContainer}>

              <View style={styles.triangle} />

              <View style={styles.dropdown}>
                {addData.map((item, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [styles.option, pressed && styles.pressedOption]}
                    onPress={() => {
                      setSettingsValue(item.value); 
                      setSettingsVisible(false); 
                    }}
                  >
                    <Ionicons name={item.icon} size={20} color="#333" style={styles.optionIcon} />
                    <Text style={styles.optionText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)", 
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdownContainer: {
    alignItems: "center",
  },
  triangle: {
    top: Platform.OS === "ios" ? 50 : -10,
    right: -30,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white", 
  },
  dropdown: {
    backgroundColor: "white",
    top: Platform.OS === "ios" ? 50 : -10,
    right: 10,
    borderRadius: 5,
    width: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  pressedOption: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  optionIcon: {
    marginRight: 5,
  },
});
