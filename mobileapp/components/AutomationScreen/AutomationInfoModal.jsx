import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import FooterButtons from "./FooterButtons";
import AutomationDetails from "./AutomationDetails"; 
import ConfirmationModal from "../UI/ConfirmationModal";
import { useState } from "react";


export default function AutomationInfoModal({
  modalVisible,
  setModalVisible,
  currentAutomation,
}) {
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const[deleteModal,setDeleteModal]=useState(false);
  if (!currentAutomation) return null;

  const handleDelete = () => {
  setDeleteModal(true);
  }
  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="fade"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <Text style={styles.autoName}>{currentAutomation.name}</Text>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <AutomationDetails currentAutomation={currentAutomation} />
          </ScrollView>

          <FooterButtons handleCloseModal={handleCloseModal} showDelete={true} handleDelete={handleDelete} />
        </View>
      </View>

      <ConfirmationModal
      visible={deleteModal}
      onClose={() => setDeleteModal(false)}
      onConfirm={() => {
    
        setDeleteModal(false);
          setTimeout(() => {
    setModalVisible(false);
  }, 250);
      }}
  
      message="Are you sure you want to delete this automation?"
      cancelLabel="No"
      confirmLabel="Yes"
      iconName="trash-outline"
      iconColor="red" 
      
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#C4C4C4",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
  },
  autoName: {
    fontSize: 30,
    fontFamily: "Lexend-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  scrollContainer: {
    width: "100%",
    marginBottom: 10,
  },
});
