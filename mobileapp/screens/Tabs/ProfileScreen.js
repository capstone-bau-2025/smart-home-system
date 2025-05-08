import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { AuthContext } from "../../store/auth-context";
import OvalButton from "../../components/UI/OvalButton";
import SVGS from "../../components/svg/SVGS";
import { Ionicons } from "@expo/vector-icons"; 
import Colors from "../../constants/Colors";
import {useSelector,useDispatch} from 'react-redux';
import { setCurrentHub } from "../../store/slices/hubSlice";


export default function ProfileScreen() {

  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.userRole);
  const userEmail = useSelector((state) => state.user.email);
  const userName = useSelector((state) => state.user.username);
  const currentHub = useSelector((state) => state.hub.currentHub);
  const userId = useSelector((state) => state.user.userId);
  const userPerms = useSelector((state) => state.user.userPerms);
  const { logout, user } = useContext(AuthContext); 


  return (
    <View style={styles.container}>
      {/* Profile Icon / SVG */}
      <SVGS />

      {/* User Info Card */}
      <View style={styles.profileCard}>
        {/* <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{user?.username || "Khaled-admin123"}</Text>
        </View> */}

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{userEmail}</Text>
        </View>

        {/* <View style={styles.infoRow}>
          <Ionicons name="lock-closed-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>••••••••</Text>
        </View> */}

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{userName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cube-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{currentHub?.name || 'name'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{currentHub?.role || 'role'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{userId}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="checkmark-done-outline" size={22} color="#2aa8a8" />
          <Text style={styles.infoText}>{userPerms}</Text>
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
