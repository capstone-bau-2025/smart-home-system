import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import TokenModal from "./TokenModal";
import { useState } from "react";
export default function TokenGeneration() {
  const [tokenVisible, setTokenVisible] = useState(false);
  
  const handleTokenModal = () => {
    setTokenVisible(!tokenVisible);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTokenModal}>
        <LinearGradient
          colors={["#edc47d", "#dc970d"]} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Add User</Text>
            <Ionicons name="person-add-outline" size={20} color="white" style={styles.icon} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

  {tokenVisible && <TokenModal visible={tokenVisible} onClose={handleTokenModal} />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20, 
  },
  button: {
    borderRadius: 12, 
    overflow: "hidden", 
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12, 
  },
  buttonContent: { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8, 
  },
  icon: {
    marginLeft: 5,
  },
});
