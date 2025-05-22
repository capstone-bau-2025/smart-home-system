import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { LOCAL_URL } from "../../util/auth";
import { ACTIVE_URL } from "../../util/auth";
import getCurrentUrl from "../../util/helperUrl";
import { setUrl } from "../../store/slices/urlSlice";
import { BASE_URL } from "../../util/auth";
import { useDispatch } from "react-redux";
export default function HubConnectionCard() {
  const currentUrl = getCurrentUrl();
  const isLocal = currentUrl === LOCAL_URL;
  const dispatch = useDispatch();
  const currentHub = useSelector((state) => state.hub.currentHub);

  if (!currentHub) return null;
  const cardConnectionStatus = isLocal
    ? "via local network"
    : "via cloud server";
  const iconColor = isLocal ? "#f4af1b" : "#00a4db";
  const iconBorderColor = isLocal ? "#f4af1b" : "#99b3ff";
  const iconBackgroundColor = isLocal ? "#ffeacf" : "#dbe3fda0";
  const iconName = isLocal ? "home-outline" : "cloud-outline";
  const connectionType = isLocal ? "Local" : "Cloud";
//          onPress={() => {
          //   const newUrl = currentUrl === BASE_URL ? LOCAL_URL : BASE_URL;
          //   dispatch(setUrl(newUrl));
          //   console.log("URL manually toggled to:", newUrl);
          // }}
  return (
    <>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            { borderColor: iconBorderColor },
            pressed && { opacity: 0.7 },
          ]}

        >
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: iconBackgroundColor },
            ]}
          >
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
          <View style={styles.labelBlock}>
            <Text
              style={styles.deviceName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {connectionType}
            </Text>
            <Text style={styles.status}>{`${cardConnectionStatus}`}</Text>
          </View>
        </Pressable>
      </View>
    </>
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
