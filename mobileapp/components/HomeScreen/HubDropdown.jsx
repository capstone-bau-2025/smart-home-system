import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropdownModal from "../UI/DropdownModal";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentHub } from "../../store/slices/hubSlice";


  // const hubData = [
  //   { label: "Hub1", value: "Hub1", icon: "cube-outline" },
  //   { label: "Hub2", value: "Hub2", icon: "cube-outline" },
  // ];


export default function HubDropdown() {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const hubs = useSelector((state) => state.hub.userHubs);
  const currentHub = useSelector((state) => state.hub.currentHubName);

  const dropdownData = hubs.map((hub) => ({
    label: hub.name,
    value: hub.serialNumber,
    icon: "cube-outline",
  }));

  const handleSelectHub = (serialNumber) => {
    const selectedHub = hubs.find((hub) => hub.serialNumber === serialNumber);
    if (selectedHub) {
      dispatch(setCurrentHub({
        serialNumber: selectedHub.serialNumber,
        hubName: selectedHub.name,
        hubDetails: selectedHub.hubDetails || {
          location: selectedHub.location,
          name: selectedHub.name,
          status: selectedHub.status,
        },
      }));
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.row}>
          <Text style={styles.selectedText}>{currentHub || "Select"}</Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color="#FFA500"
            style={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>

      <DropdownModal
        key={currentHub}
        data={dropdownData}
        setVisible={setModalVisible}
        visible={modalVisible}
        onSelect={handleSelectHub}
        triposition={
          Platform.OS === "ios"
            ? { right: 177, top: 30 }
            : { right: 160, top: -20 }
        }
        position={
          Platform.OS === "ios"
            ? { right: 200, top: 30 }
            : { right: 180, top: -20 }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    width: 160,
    borderRadius: 8,
    overflow: "hidden",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 30,
    color: "#333",
    fontFamily: "Lexend-Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    padding: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
    justifyContent: "space-between",
    marginLeft: 15,
  },
});
