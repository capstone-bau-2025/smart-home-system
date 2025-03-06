import { StyleSheet, Text, TouchableOpacity, View,  Alert, } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import RemoveUser from "./RemoveUser";
import PermsModal from "./PermsModal";
import TokenGeneration from "./TokenGeneration";

export default function UsersList({ users }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [usersPerms,setUsersPerms] = useState(users);
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
  const updatePermissions = (userId, updatedPerms) => {
    setUsersPerms((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, perms: updatedPerms } : user
      )
    );
  };
  return (
    <>
      <FlatList
      ListHeaderComponent={
        <TokenGeneration  />
      }
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <LinearGradient
              colors={["#FFAA33", "#FF7700"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.container}
            >
              <View style={styles.textContainer}>
                <Text style={styles.userText}>{item.name}</Text>
                <Text style={styles.roleText}> - {item.role}</Text>
              </View>

              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => handleOpenModal("edit", item.id)}
                >
                  <Ionicons name="create-outline" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => handleOpenModal("remove", item.id)}
                >
                  <Ionicons name="remove-circle-outline" size={28} color="red" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
      />

      {/* Remove User Modal */}
      {modalType === "remove" && (
        <RemoveUser
          visible={modalType === "remove"}
          onClose={handleCloseModal}
          userId={selectedUserId}
        />
      )}

      {/* Permissions Modal */}
      {modalType === "edit" && (
        <PermsModal
          visible={modalType === "edit"}
          onClose={handleCloseModal}
          userId={selectedUserId}
          users={users}
          updatePermissions={updatePermissions}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  itemWrapper: {
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 300,
    height: 70,
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 15,
    overflow: "hidden",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    fontSize: 27,
    fontWeight: "bold",
    color: "white",
  },
  roleText: {
    fontSize: 27,
    fontWeight: "normal",
    color: "white",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 6,
    borderRadius: 50,
    marginRight: 10,
  },
  removeIcon: {
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: 50,
  },
});
