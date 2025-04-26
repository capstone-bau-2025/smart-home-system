// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import TokenModal from "./TokenModal";
// import { useState } from "react";

// //allows the user to generate a token for the hub
// export default function TokenGeneration() {
//   const [tokenVisible, setTokenVisible] = useState(false);
  
//   const handleTokenModal = () => {
//     setTokenVisible(!tokenVisible);
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.button} onPress={handleTokenModal}>

//     <View style={styles.buttonContainer}>
//               <Ionicons name="person-add-outline" size={20} color="#000000"  />
//     </View>

//       </TouchableOpacity>

//   <TokenModal visible={tokenVisible} onClose={handleTokenModal} />

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "flex-end",
//     margin: 20, 
//   },
//   button: {
//     borderRadius: 12, 
//     overflow: "hidden", 
//   },
//   buttonContainer: {
//     backgroundColor:'#FEA220',
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 50, 
//     padding:12
//   },
//   buttonContent: { 

//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginRight: 8, 
//   },
//   icon: {
//     marginLeft: 5,
//   },
// });
