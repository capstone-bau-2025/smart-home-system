import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RoomCard({ room, icon, devices, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}> 
      <LinearGradient
        colors={["#e19b19", "#ffae75"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Ionicons name={icon} style={styles.icons} size={32} />
          <Text style={styles.devices}>
            {devices.length} Devices <Ionicons name="create-outline" style={styles.editIcon} size={25} />
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120, 
    width: 120, 
    marginVertical: 10,
    marginHorizontal: 7,
    borderRadius: 15, 
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5, 
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontFamily: "Lexend-Regular",
  },
  icons: {
    marginVertical: 8, 
    color: "white",
  },
  devices: {
    textAlign: "center",
    fontSize: 14, 
    color: "#fff",
    fontFamily: "Lexend-Regular",
  },
  editIcon: {
    marginLeft: 5, 
  },
});
