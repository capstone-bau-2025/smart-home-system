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

export default function HubDropdown({ currentHub, }) {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const userHubs = useSelector((state) => state.hub.userHubs);

  const noHub = "Hub not found";

  const dropdownData = userHubs.map((hub) => ({
    label: hub.name || "Unnamed Hub",
    value: hub, // pass full hub object
    icon: "cube-outline",
  }));

  const handleSelectHub = (hub) => {
    console.log('Selected Hub: ', hub)
    if (hub) {
      dispatch(setCurrentHub(hub));
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
          <Text
            style={styles.selectedText}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {currentHub?.name && currentHub.name !== "Central Hub"
              ? currentHub.name
              : noHub}
          </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color="#FFA500"
            style={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>

      <DropdownModal
  
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    justifyContent: "space-between",
    marginLeft: 15,
  },
});
