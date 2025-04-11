import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropdownModal from "../UI/DropdownModal";

export default function HubDropdown({ currentHub, setCurrentHub }) {
  const [modalVisible, setModalVisible] = useState(false);

  const hubData = [
    { label: "Hub1", value: "Hub1" , icon: "cube-outline"},
    { label: "Hub2", value: "Hub2", icon: "cube-outline" },
  ];

  const handleSelectHub = (value) => {
    setCurrentHub(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.row}>
          <Text style={styles.selectedText}>{currentHub || "Select Hub"} </Text>
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color="#FFA500"
            style={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>

      <DropdownModal
        data={hubData}
        setVisible={setModalVisible}
        visible={modalVisible}
        onSelect={handleSelectHub}
        triposition={
          Platform.OS === "ios"
            ? { right: 177, top: 50 }
            : { right: 140, top: -5 }
        }
        position={
          Platform.OS === "ios"
            ? { right: 200, top: 50 }
            : { right: 150, top: -5 }
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
    paddingHorizontal: 10,
    paddingVertical: 12,
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
    marginLeft:15
  },
});
