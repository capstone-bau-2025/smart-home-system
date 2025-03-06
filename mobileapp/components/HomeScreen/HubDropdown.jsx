import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

export default function HubDropdown({ selectedHub, setselectedHub }) {
  const hubData = [
    { label: "Hub1", value: "Hub1" },
    { label: "Hub2", value: "Hub2" },
    
  ];

  return (
    <View style={styles.dropdownContainer}>
      
      <Dropdown
        data={hubData}
        labelField="label"
        valueField="value"
        value={selectedHub}
        onChange={(item) => setselectedHub(item.value)}
        style={styles.dropdown}
        placeholder={null}
        selectedTextStyle={styles.selectedText}
        renderRightIcon={() => (
          <Ionicons
            name="chevron-down-outline"
            size={20}
            color="#FFA500"
            style={styles.iconStyle}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
    
  },
  dropdown: {
    width: 160,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 30,
    paddingVertical: 8,
    
  },
  selectedText: {
    fontSize: 27,
    fontFamily: "Lexend-Regular",
    flex: 1,
  },
  iconStyle: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
});
