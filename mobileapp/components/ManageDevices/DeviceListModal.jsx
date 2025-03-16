// import React, { useState } from "react";
// import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from "react-native";
// import DeviceCard from "./DeviceCard";
// import ConfirmationModal from "./ConfirmationModal";

// export default function DeviceListModal({ visible, onClose, room, selectedTab,selectedDevice,setSelectedDevice  }) {
//   const [confirm, setConfirm] = useState(false);

//   function pressHandler(device) {
//     setSelectedDevice(device)
//     setConfirm(true);
//   }
//   function handleClose() {
//     setConfirm(false); 
//     setSelectedDevice(null); 
  
//   }
  
//   if (!room || !selectedTab) return null; 

//   return (
//     <Modal animationType="slide" transparent={false} visible={visible}>
//       <View style={styles.modalContainer}>
//         {/* Modal Header */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Devices in {selectedTab.name}</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Text style={styles.closeText}>X</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.info}>Choose devices to move to {room.name}</Text>

//         <FlatList
//           data={selectedTab.rooms.filter(r => r.id !== room.id)} 
//           keyExtractor={(room) => room.id}
//           contentContainerStyle={styles.listContainer}
//           renderItem={({ item: filteredRoom }) => (
//             <View style={styles.roomContainer}>
//               <Text style={styles.roomName}>{filteredRoom.name}</Text>

//               {filteredRoom.devices.length > 0 ? (
//                 <FlatList
//                   data={filteredRoom.devices}
//                   keyExtractor={(device) => device.id}
//                   renderItem={({ item: device }) => (
//                     <DeviceCard device={device} onPress={() => pressHandler(device)} />
//                   )}
//                 />
//               ) : (
//                 <Text style={styles.noDevices}>No devices available</Text>
//               )}
//             </View>
//           )}
//         />

//         {confirm && <ConfirmationModal visible={confirm} onClose={handleClose} room={room} selectedDevice={selectedDevice}  />}
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "#FDF8F0",
//     paddingTop: 50,
//     alignItems: "center",
//   },
//   header: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#e19b19",
//   },
//   closeButton: {
//     backgroundColor: "#e19b19",
//     width: 35,
//     height: 35,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 20,
//   },
//   closeText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   listContainer: {
//     width: "100%",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   roomContainer: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     width:350
//   },
//   roomName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#e19b19",
//     marginBottom: 10,
//   },
//   noDevices: {
//     fontSize: 16,
//     fontStyle: "italic",
//     color: "gray",
//     textAlign: "center",
//   },
//   info: {
//     fontFamily: "Lexend-Bold",
//     color: "#2aa8a8",
//     fontSize: 20,
//     marginVertical: 10,
//   },
// });
