import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HubsTabs from "../../components/ManageHub/HubsTabs";
import { useState } from "react";
import UsersList from "../../components/ManageHub/UsersList";
import { hubs } from "../../Data/Hubs";

export default function ManageHub() {
  const [selectedTab, setSelectedTab] = useState(hubs[0]); 


  const userCount = selectedTab.users.length;
  

  const roleCounts = selectedTab.users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

    
        <HubsTabs hubs={hubs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <View style={styles.countContainer}>
          <Text style={styles.countText}>Total Users: {userCount}</Text>
          {Object.entries(roleCounts).map(([role, count]) => (
            <Text key={role} style={styles.countText}>
              {role.charAt(0).toUpperCase() + role.slice(1)}: {count}
            </Text>
          ))}
        </View>

        <UsersList users={selectedTab.users} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e19b19",
  },
});
