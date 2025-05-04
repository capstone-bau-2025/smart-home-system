import React, { useState } from "react";
import { StyleSheet } from "react-native";
import ConfirmationModal from "../UI/ConfirmationModal";
import PermsModal from "./PermsModal";
import ScrollableList from "../UI/ScrollableList";

// A component that displays a list of users with their permissions and allows the user to edit or remove them
export default function UsersList({ users, setRenameModal }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [usersPerms, setUsersPerms] = useState(users);

  const handleOpenModal = (type, userId) => {
    setSelectedUserId(userId);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setTimeout(() => {
      setSelectedUserId(null);
    }, 300);
  };

  const handleRemoveUser = () => {
    console.log(`User ${selectedUserId} removed`);
    handleCloseModal();
  };

  const updatePermissions = (userId, updatedPerms) => {
    setUsersPerms((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, perms: updatedPerms } : user
      )
    );
  };

  return (
    <>
      <ScrollableList
        data={users}
        textFields={["username", "role"]}
        buttonConfig={[
          {
            icon: "key-outline",
            onPress: (user) => handleOpenModal("edit", user.id),
          },
          { icon: "pencil-outline", onPress: () => setRenameModal(true) },
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
        users={users}
        updatePermissions={updatePermissions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: { flexGrow: 1, paddingBottom: 80 },
  itemWrapper: { alignItems: "center" },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "97%",
    height: 70,
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 15,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "orange",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 0,
  },
  textContainer: { flexDirection: "row", alignItems: "center" },
  userText: { fontSize: 27, fontWeight: "bold", color: "#000000" },
  roleText: { fontSize: 27, fontWeight: "normal", color: "#000000" },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  editIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 6,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: "orange",
  },
  removeIcon: {
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
    backgroundColor: "orange",
  },
});
