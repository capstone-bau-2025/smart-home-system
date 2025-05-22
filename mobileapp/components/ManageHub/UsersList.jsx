import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ConfirmationModal from "../UI/ConfirmationModal";
import PermsModal from "./PermsModal";
import ScrollableList from "../UI/ScrollableList";
import { useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../../api/services/userService";
import Toast from "react-native-toast-message";

export default function UsersList({ users, setRenameModal }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUsername] = useState(null);
  const hubSerialNumber = useSelector(
    (state) => state.hub.currentHub?.serialNumber
  );

  useEffect(() => {
    setUsersList(users);
  }, [users]);
  const handleOpenModal = (type, userId) => {
    setSelectedUserId(userId);
    setUsername(usersList.find((user) => user.id === userId)?.username);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setTimeout(() => setSelectedUserId(null), 300);
  };

  const handleRemoveUser = async () => {
    try {
      await deleteUser(selectedUserId, hubSerialNumber);
      setUsersList((prev) => prev.filter((user) => user.id !== selectedUserId));
      Toast.show({
        type: "success",
        text1: "User removed",
        text2: `User ID ${selectedUserId} was removed successfully.`,
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
      });
      handleCloseModal();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to remove user",
        text2: err.message || "Something went wrong.",
        position: "top",
      });
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetchUsers(hubSerialNumber);

      setUsersList(res);
    } catch (err) {
      console.error("Refresh failed:", err);
      Toast.show({
        type: "error",
        text1: "Refresh failed",
        text2: err.message || "Could not update users.",
        position: "top",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>

        <ScrollableList
          data={usersList}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          textFields={["username", "role"]}
          buttonConfig={[
            {
              icon: "key-outline",
              onPress: (user) => handleOpenModal("edit", user.id),
            },
            // { icon: "pencil-outline", onPress: () => setRenameModal(true) },
            {
              icon: "remove-circle-outline",
              onPress: (user) => handleOpenModal("remove", user.id),
            },
          ]}
        />

      <ConfirmationModal
        visible={modalType === "remove"}
        onClose={handleCloseModal}
        onConfirm={handleRemoveUser}
        title="Remove User"
        message="Are you sure you want to remove this user?"
        iconName="alert-circle-outline"
        iconColor="red"
        confirmLabel="Yes"
        cancelLabel="No"
      />

      <PermsModal
        visible={modalType === "edit"}
        onClose={handleCloseModal}
        userId={selectedUserId}
        users={usersList}
        hubSerialNumber={hubSerialNumber}
        userName={userName}
      />
    </>
  );
}
