import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../store/auth-context";
import OvalButton from "../../components/UI/OvalButton";
import SVGS from "../../components/svg/SVGS";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useSelector } from "react-redux";

export default function ProfileScreen() {
  const userRole = useSelector((state) => state.user.userRole);
  const userEmail = useSelector((state) => state.user.email);
  const userName = useSelector((state) => state.user.username);
  const currentHub = useSelector((state) => state.hub.currentHub);
  const userId = useSelector((state) => state.user.userId);
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <SVGS />

      <View style={styles.profileCard}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={22} color="#2aa8a8" />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={22} color="#2aa8a8" />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{userName}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cube-outline" size={22} color="#2aa8a8" />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Current Hub</Text>
            <Text style={styles.value}>{currentHub?.name || "No current hub"}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={22} color="#2aa8a8" />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{currentHub?.role || " "}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={22} color="#2aa8a8" />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.value}>{userId}</Text>
          </View>
        </View>
      </View>

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
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  infoTextBlock: {
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Lexend-Regular",
  },
  value: {
    fontSize: 18,
    color: "#000",
    fontFamily: "Lexend-Medium",
  },
});
