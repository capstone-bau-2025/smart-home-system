import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { AuthContext } from "../../store/auth-context";
import OvalButton from "../../components/UI/OvalButton";
import SVGS from "../../components/svg/SVGS";
import { Ionicons } from "@expo/vector-icons"; 
import Colors from "../../constants/Colors";

export default function ProfileScreen() {
  const { logout, user } = useContext(AuthContext); 

  return (
    <View style={styles.container}>
      {/* Profile Icon / SVG */}
      <SVGS />

      {/* User Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{user?.username || "Khaled-admin123"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{user?.email || "khaledemail@gmail.com"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="lock-closed-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>••••••••</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{user?.role || "Admin"}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <OvalButton text="Logout" color="black" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryBackground,
  },
  profileCard: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "Lexend-Regular",
  },
});
