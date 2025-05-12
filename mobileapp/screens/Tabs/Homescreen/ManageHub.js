import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import HubsTabs from "../../../components/UI/HubsTabs";
import { useEffect, useState } from "react";
import UsersList from "../../../components/ManageHub/UsersList";
import { hubs } from "../../../Data/Hubs";
import InfoModal from "../../../components/UI/InfoModal";
import TokenModal from "../../../components/ManageHub/TokenModal";
import RenameModal from "../../../components/UI/RenameModal";
import { updateHubName } from "../../../api/services/hubService";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentHub, setUserHubs } from "../../../store/slices/hubSlice";
import { fetchUserDetails } from "../../../api/services/userService";
import { fetchUsers } from "../../../api/services/userService";
import { setUserId } from "../../../store/slices/userSlice";
export default function ManageHub({
  setAddModal,
  setCogModal,
  setInfoModal,
  infoModal,
  addModal,
  cogModal,
}) {
  const currentHub = useSelector((state) => state.hub.currentHub);
  const userHubs = useSelector((state) => state.hub.userHubs);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(userHubs?.[0] ?? null);
  useEffect(() => {
    const fetchUsersAsync = async () => {
      if (!selectedTab?.serialNumber) return;
  
      try {
        const usersRes = await fetchUsers(selectedTab.serialNumber);
        const userDetails = await fetchUserDetails();
  
        // const matchedUser = usersRes.find(
        //   (user) => user.email === userDetails.email
        // );



        // if (matchedUser) {
        //   dispatch(setUserId(matchedUser.id));
        // }
  
        setUsers(usersRes);
      } catch (err) {
        console.error("Failed to fetch users or user details:", err);
      }
    };
  
    fetchUsersAsync();
  }, [selectedTab]);


  const [hubname, setHubName] = useState(currentHub?.name || "");
  const [userRenameModal, setUserRenameModal] = useState(false);
  const [userNewName, setUserNewname] = useState("");

  const dispatch = useDispatch();

  const userCount = users.length;

  const roleCounts = users.reduce((acc, user) => {
    const role = user.role.charAt(0) + user.role.slice(1).toLowerCase();
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  async function handleUpdateHubName(newName) {
    try {
      await updateHubName(newName);
      const data = await fetchUserDetails();
      dispatch(setUserHubs(data.hubsConnected));

      const updatedHub = data.hubsConnected.find(
        (hub) => hub.serialNumber === currentHub.serialNumber
      );

      if (updatedHub) {
        dispatch(setCurrentHub(updatedHub));
      } else {
        dispatch(
          setCurrentHub({
            name: newName,
            serialNumber: currentHub.serialNumber,
            role: currentHub.role,
          })
        );
      }

      setHubName(newName);
      setCogModal(false);

      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: "Name updated",
        text2: `Hub name is now ${newName}.`,
      });
    } catch (error) {
      console.log("Failed to update hub name:", error);
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "error",
        text1: "Failed to update",
        text2: `Hub name could not be updated.`,
      });
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <HubsTabs
        hubs={userHubs}
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
        users={users}
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
