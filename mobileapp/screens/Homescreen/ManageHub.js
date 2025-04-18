import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HubsTabs from "../../components/ManageHub/HubsTabs";
import { useState } from "react";
import UsersList from "../../components/ManageHub/UsersList";
import { hubs } from "../../Data/Hubs";
import InfoModal from "../../components/UI/InfoModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import TokenModal from "../../components/ManageHub/TokenModal";
import RenameModal from "../../components/UI/RenameModal";
export default function ManageHub(currentHub) {
  const [selectedTab, setSelectedTab] = useState(hubs[0]);
  const [addModal, setAddModal] = useState(false);
  const [cogModal, setCogModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);

  const userCount = selectedTab.users.length;

  const roleCounts = selectedTab.users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.headerIcons}>
        <HeaderIcons
          onInfoPress={() => setInfoModal(true)}
          onAddPress={() => setAddModal(true)}
          onCogPress={() => console.log("Cog pressed, rename hub and delete")}
        />
      </View>

      <HubsTabs
        hubs={hubs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <View style={styles.countContainer}>
        <Text style={styles.countText}>Total Users: {userCount}</Text>
        {Object.entries(roleCounts).map(([role, count]) => (
          <Text key={role} style={styles.countText}>
            {role.charAt(0).toUpperCase() + role.slice(1)}: {count}
          </Text>
        ))}
      </View>
      <UsersList users={selectedTab.users} setRenameModal={setRenameModal} />

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message={"In this screen, you can...."}
        title={"Manage Hubs"}
      />
      <TokenModal visible={addModal} onClose={() => setAddModal(false)} />
      <RenameModal
        visible={renameModal}
        onClose={() => setRenameModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f1f1f1",
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
  headerIcons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 15,


  },
});
