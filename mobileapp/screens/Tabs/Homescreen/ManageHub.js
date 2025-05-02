import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import HubsTabs from "../../../components/UI/HubsTabs";
import { useState } from "react";
import UsersList from "../../../components/ManageHub/UsersList";
import { hubs } from "../../../Data/Hubs";
import InfoModal from "../../../components/UI/InfoModal";
import HeaderIcons from "../../../components/UI/HeaderIcons";
import TokenModal from "../../../components/ManageHub/TokenModal";
import RenameModal from "../../../components/UI/RenameModal";
import MidModal from "../../../components/UI/MidModal";
import { updateHubName } from "../../../api/services/hubService";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { setCurrentHub } from "../../../store/slices/hubSlice";

export default function ManageHub({
  currentHub,
  setAddModal,
  setCogModal,
  setInfoModal,
  infoModal,
  addModal,
  cogModal,
}) {
  const [selectedTab, setSelectedTab] = useState(hubs[0]);
  const [hubname, setHubName] = useState(currentHub.name || "");
  const [userRenameModal, setUserRenameModal] = useState(false);
  const [userNewName, setUserNewname] = useState("");
  const dispatch = useDispatch();

  const userCount = selectedTab.users.length;

  const roleCounts = selectedTab.users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  async function handleUpdateHubName(newName) {
    try {
      const result = await updateHubName(newName);
      console.log("Hub name updated: " + newName);
      setHubName(newName);
      dispatch(setCurrentHub({
        serialNumber: currentHub.serialNumber, 
        hubName: newName,
        hubDetails: {
          ...currentHub.hubDetails,
          name: newName, 
        },
      }));
      setCogModal(false);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1Style: {
          fontFamily: "Lexend-Bold",
          fontSize: 16,
          color: "black",
        },
        text2Style: {
          fontFamily: "Lexend-Regular",
          fontSize: 14,
          color: "#a8a8a8",
        },
        text1: "Name updated",
        text2: `Hub name is now ${newName}.`,
      });
    } catch (error) {
      console.log("Failed to update hub name:", error);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        
        type: "error",
        text1Style: {
          fontFamily: "Lexend-Bold",
          fontSize: 16,
          color: "black",
        },
        text2Style: {
          fontFamily: "Lexend-Regular",
          fontSize: 14,
          color: "#a8a8a8",
        },
        text1: "Failed to update",
        text2: `Hub name could not be updated.`,
      });
    }
  }

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
      <UsersList
        users={selectedTab.users}
        setRenameModal={setUserRenameModal}
      />

      <InfoModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        cancelLabel="Close"
        iconName="help-outline"
        iconColor="orange"
        message={
          "In this screen, you can configure users' name, permissions, add, and delete"
        }
        title={"Manage Hubs"}
      />
      <TokenModal visible={addModal} onClose={() => setAddModal(false)} />

      <RenameModal
        visible={cogModal}
        setVisible={setCogModal}
        value={hubname}
        setValue={setHubName}
        title={"Change hub name"}
        placeholder={"enter a new hub name"}
        onConfirm={handleUpdateHubName}
        
      />

      <RenameModal
        visible={userRenameModal}
        setVisible={setUserRenameModal}
        value={userNewName}
        setValue={setUserNewname}
        title={"Change the user name"}
        placeholder={"enter a new user name"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,

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
