import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export default function AutomationCard({ handleToggleAutomation, item, setModalVisible, setCurrentAutomation }) {
  function handlePress() {
    setCurrentAutomation(item); 
    setModalVisible(true);
  }

  return (
    <Pressable style={({ pressed }) => (pressed ? styles.pressed : null)} onPress={handlePress}>
      <LinearGradient colors={["#b1cff5", "#56CCF2", "#BBE1FA"]}
 start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.listsContainer}>
        <Text style={styles.text}>{item.name}</Text>
        <View style={styles.iconContainer}>
          <Pressable style={({ pressed }) => (pressed ? styles.pressed : null)} onPress={() => handleToggleAutomation(item.id)}>
            <Ionicons name="power-outline" size={30} color="black" style={styles.powerIcon} />
          </Pressable>
          <Ionicons name="ellipse-sharp" size={30} color={item.status === "Active" ? "green" : "red"} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Lexend-Bold",
  },
  listsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 10,
    borderTopRightRadius: 0,  
    borderBottomRightRadius: 20,  
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 0,
    width:'90%',
    alignSelf: "center", 
  },
  text: {
    color: "black",
    fontSize: 24,
    fontFamily: "Lexend-Regular",
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  powerIcon: {
    marginRight: 10,
  },
  addContainer: {
    right: 10,
    alignSelf: "flex-end",
  },
});
