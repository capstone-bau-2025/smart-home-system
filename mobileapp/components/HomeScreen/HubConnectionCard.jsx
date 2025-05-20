import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LOCAL_URL } from "../../util/auth";

export default function HubConnectionCard() {
  const currentUrl = useSelector((state) => state.url.currentUrl);
  const isLocal = currentUrl === LOCAL_URL;

  const cardConnectionStatus = isLocal ? "Connected" : "Connected";
  const iconColor = isLocal ? "#f4af1b" : "#00a4db";
  const iconBorderColor = isLocal ? "#f4af1b" : "#99b3ff";
  const iconBackgroundColor = isLocal ? "#ffeacf" : "#dbe3fda0";
  const iconName = isLocal ? "home-outline" : "cloud-outline";
  const connectionType = isLocal ? "Local" : "Cloud";

  return (
    <View style={[styles.card, { borderColor: iconBorderColor }]}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.labelBlock}>
        <Text style={styles.deviceName} numberOfLines={1} ellipsizeMode="tail">
          {connectionType} 
        </Text>
        <Text style={styles.status}>{`${cardConnectionStatus}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
    width: 170,
    marginBottom: 20,
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  labelBlock: {
    flex: 1,
    justifyContent: "center",
  },
  deviceName: {
    fontSize: 14,
    fontFamily: "Lexend-Regular",
    color: "#000",
  },
  status: {
    fontSize: 12,
    fontFamily: "Lexend-Regular",
    color: "#666",
  },
});
