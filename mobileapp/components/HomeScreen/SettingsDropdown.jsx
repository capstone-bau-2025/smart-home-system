import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropdownModal from "../UI/DropdownModal";

//the dropdown modal that shows when settings is clicked
export default function SettingsDropdown({
  settingsValue,
  setSettingsValue,
  settingsVisible,
  setSettingsVisible,
}) {
  const navigation = useNavigation();

  const settingsData = [
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
    <>
      <DropdownModal
        data={settingsData}
        onSelect={(value) => setSettingsValue(value)}
        setVisible={setSettingsVisible}
        visible={settingsVisible}
        position={
          Platform.OS === "ios"
            ? { right: 40, top: 40 }
            : { right: 10, top: -20 }
        }
        triposition={
          Platform.OS === "ios"
            ? { right: -30, top: 40 }
            : { right: -30, top: -20 }
        }
      />
    </>
    // <Modal visible={settingsVisible} transparent animationType="fade">
    //   <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
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
    //                   setSettingsValue(item.value);
    //                   setSettingsVisible(false);
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

const styles = StyleSheet.create({});
