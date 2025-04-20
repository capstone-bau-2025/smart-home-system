

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import HubsTabs from "../../components/ManageHub/HubsTabs";
import { useState } from "react";
import UsersList from "../../components/ManageHub/UsersList";
import { hubs } from "../../Data/Hubs";
import InfoModal from "../../components/UI/InfoModal";
import HeaderIcons from "../../components/UI/HeaderIcons";
import TokenModal from "../../components/ManageHub/TokenModal";
import RenameModal from "../../components/UI/RenameModal";
import MidModal from "../../components/UI/MidModal";

export default function ManageHub({
  currentHub,
  setAddModal,
  setCogModal,
  setInfoModal,
  infoModal,
  addModal,
  cogModal,
}){
  const [selectedTab, setSelectedTab] = useState(hubs[0]);
  const [hubname, setHubName] = useState(currentHub.name);
  const [userRenameModal, setUserRenameModal] = useState(false);
  const [userNewName, setUserNewname] = useState("");

  const userCount = selectedTab.users.length;

  const roleCounts = selectedTab.users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />


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
      <UsersList users={selectedTab.users} setRenameModal={setUserRenameModal} />

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message={"In this screen, you can configure users' name, permissions, add, and delete"}
        title={"Manage Hubs"}
      />
      <TokenModal visible={addModal} onClose={() => setAddModal(false)} />

      <RenameModal  visible={cogModal} setVisible={setCogModal} value={hubname} setValue={setHubName} title={'Change hub name'} placeholder={'enter a new hub name'}/>
      
      <RenameModal  visible={userRenameModal} setVisible={setUserRenameModal} value={userNewName} setValue={setUserNewname} title={'Change the user name'} placeholder={'enter a new user name'}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
