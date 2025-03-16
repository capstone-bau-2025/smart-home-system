import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import RoomModal from "./RoomModal";
import TokenModal from "../ManageHub/TokenModal";
import DeviceListModal from "./DeviceListModal";

export default function MoveDevice({
  onMove,
  room,
  selectedTab,
  selectedDevice,
  setSelectedDevice 
}) {}
//   const [modalVisible, setModalVisibile] = useState(false);

//   function moveHandler() {
//     setModalVisibile(true);
//   }

//   return (
//     <>
//       {/* <Pressable
//         style={({ pressed }) => [
//           styles.container,
//           pressed && styles.pressedContainer,
//         ]}
//         onPress={moveHandler}
//       >
//         <Text style={styles.moveText}>
//           Move a device to this <Text style={styles.underline}>Room</Text>
//         </Text>
//         <Ionicons
//           name="swap-horizontal-outline"
//           size={24}
//           style={styles.icon}
//         />
//       </Pressable> */}
    

//       {modalVisible && (
//         <DeviceListModal
//           visible={modalVisible}
//           onClose={() => setModalVisibile(false)}
//           room={room}
//           selectedDevice={selectedDevice}
//           selectedTab={selectedTab}
//           setSelectedDevice={setSelectedDevice }
//         />
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 8,
//     marginHorizontal: 10,
//   },
//   pressedContainer: {
//     opacity: 0.7,
//   },
//   moveText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#D18900",
//     marginRight: 8,
//     fontFamily: "Lexend-Regular",
//   },
//   icon: {
//     color: "#e19b19",
//   },
//   underline: {
//     textDecorationLine: "underline",
//     color: "#2aa8a8",
//   },
//   info: {
//     fontSize: 20,
//     color: "#2aa8a8",
//     marginHorizontal: 10,
//     fontFamily: "Lexend-Regular",

//   },
// });
