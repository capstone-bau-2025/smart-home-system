import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropdownModal from "../UI/DropdownModal";

//the dropdown modal that shows when + is clicked
export default function AddDropdown({
  addValue,
  setAddValue,
  addVisible,
  setAddVisible,
}) {
  const navigation = useNavigation();

  const addData = [
    { label: "Discover Hub", value: "DHub", icon: "cube-outline" },
    { label: "Discover Device", value: "DDevice", icon: "tv-outline" },
  ];

  useEffect(() => {
     if (addValue === "DHub") {
      navigation.navigate("DiscoverHub");
      setAddValue(null);
    }
    else if (addValue === "DDevice") {
      navigation.navigate("DiscoverDevice");
      setAddValue(null);
    } 
  }, [addValue, navigation]);

  return (
    <DropdownModal
      data={addData}
      onSelect={(value) => setAddValue(value)}
      setVisible={setAddVisible}
      visible={addVisible}
      position={
        Platform.OS === "ios" ? { right: 70, top: 40 } : { right: 50, top: -20 }
      }
      triposition={
        Platform.OS === "ios" ? { right: 10, top: 40 } : { right: 10, top: -20 }
      }
    />

    // <Modal visible={addVisible} transparent animationType="fade">
    //   <TouchableWithoutFeedback onPress={() => setAddVisible(false)}>
    //     <View style={styles.overlay}>
    //       <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
    //         <View style={styles.dropdownContainer}>

    //           <View style={styles.triangle} />

    //           <View style={styles.dropdown}>
    //             {addData.map((item, index) => (
    //               <Pressable
    //                 key={index}
    //                 style={({ pressed }) => [styles.option, pressed && styles.pressedOption]}
    //                 onPress={() => {
    //                   setAddValue(item.value);
    //                 }}
    //               >
    //                 <Ionicons name={item.icon} size={20} color="#333" style={styles.optionIcon} />
    //                 <Text style={styles.optionText}>{item.label}</Text>
    //               </Pressable>
    //             ))}
    //           </View>
    //         </View>
    //       </TouchableWithoutFeedback>
    //     </View>
    //   </TouchableWithoutFeedback>
    // </Modal>
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
    right: 15,
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
    right: 70,
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
