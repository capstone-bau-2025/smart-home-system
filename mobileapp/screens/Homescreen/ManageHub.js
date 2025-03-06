import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HubsTabs from "../../components/ManageHub/HubsTabs";
import { useState } from "react";
import UsersList from "../../components/ManageHub/UsersList";
import TokenGeneration from "../../components/ManageHub/TokenGeneration";

export default function ManageHub() {
  const hubs = [
    {
      id: "1",
      name: "hub1",
      users: [
        {
          id: "101",
          name: "user1",
          role: "admin",
          perms: {
            livingroom: true,
            bedroom: true,
            kitchen: true,
            bathroom: true,
          },
        },
        {
          id: "102",
          name: "user2",
          role: "guest",
          perms: {
            livingroom: true,
            bedroom: false,
            kitchen: false,
            bathroom: false,
          },
        },
      ],
    },
    {
      id: "2",
      name: "hub2",
      users: [
        {
          id: "103",
          name: "user1",
          role: "user",
          perms: {
            livingroom: true,
            bedroom: true,
            kitchen: false,
            bathroom: false,
          },
        },
        {
          id: "104",
          name: "user2",
          role: "user",
          perms: {
            livingroom: true,
            bedroom: false,
            kitchen: true,
            bathroom: false,
          },
        },
        {
          id: "105",
          name: "user3",
          role: "guest",
          perms: {
            livingroom: true,
            bedroom: true,
            kitchen: false,
            bathroom: false,
          },
        },
      ],
    },
  ];

  const [selectedTab, setSelectedTab] = useState(hubs[0]); // Store the selected hub

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {/* Tabs for selecting different hubs */}
        <HubsTabs hubs={hubs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {/* Pass only the selected hub's users */}
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
});
