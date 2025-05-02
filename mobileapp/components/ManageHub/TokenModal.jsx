import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import InfoModal from "../UI/InfoModal";
import { generateInviteCode } from "../../api/services/invitationService";


//opens a modal for the admin to generate invitation codes for users to join the hub
export default function TokenModal({ visible, onClose }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const[roleId, setRoleId] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('codebasedonrole');

  const handleClose = () => {
    onClose();
    setSelectedRole(null);
    setRoleId(null);
    setInfoModal(false);
    const timeout = setTimeout(() => {
      setInviteCode('codebasedonrole');
    }, 300); 
  };
  

  const handleGenerateInvite = async (id) => {
    try {
      const result = await generateInviteCode(id);
      setInviteCode(result.code);
    } catch (error) {
      Alert.alert('Error', 'Could not generate invite code.');
    }
  };

  const handleRoleSelection = async (roleName) => {
    let roleId;
  
    if (roleName === 'Admin') roleId = 1;
    else if (roleName === 'User') roleId = 2;
    else if (roleName === 'Guest') roleId = 3;
    else if(onClose) roleId = null
    setSelectedRole(roleName);   
    setRoleId(roleId);          
  
    await handleGenerateInvite(roleId); 
  };

const copyToClipboard = () => {
  if (inviteCode) {
    Clipboard.setStringAsync(inviteCode);
    Alert.alert("Copied!", "Invite code copied to clipboard.");
  } else {
    Alert.alert("No code", "Please generate a code first.");
  }
};
  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        hideModalContentWhileAnimating={true}
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                {/* Invite Code Section */}
                <Text style={styles.title}>Invite Code</Text>
                <View style={styles.inviteRow}>
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    style={styles.codeContainer}
                  >
                    <Text style={styles.inviteCode}>{inviteCode}</Text>
                    <Ionicons name="copy-outline" size={20} color="#FFA500" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.infoContainer}
                    onPress={() => setInfoModal(true)}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={30}
                      color="#FFA500"
                    />
                  </TouchableOpacity>
                </View>

                {/* Role Selection Buttons */}
                <Text style={styles.subtitle}>Select role to generate a code:</Text>
                <View style={styles.roleButtonsContainer}>
                  {["Admin", "User", "Guest"].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleButton,
                        selectedRole === role && styles.selectedRoleButton,
                      ]}
                      onPress={() => handleRoleSelection(role)}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          selectedRole === role &&
                            styles.selectedRoleButtonText,
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Close Button */}
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>

        <InfoModal
          visible={infoModal}
          onClose={() => setInfoModal(false)}
          cancelLabel="Close"
          iconName="help-outline"
          iconColor="orange"
          message={"To add a user to the hub, first generate an invite code and share it with them. After they discover the hub, they can enter the code to join."}
          title={"Add a user"}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginVertical: 10,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  inviteCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#555",
    width: 'auto',
  },
  inviteRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  roleButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  infoContainer: {
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    marginLeft: 10,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#ddd",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedRoleButton: {
    backgroundColor: "#FFA500",
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedRoleButtonText: {
    color: "white",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
