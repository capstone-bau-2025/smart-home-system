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
import { deleteAutomation } from "../../api/services/automationService";
import Toast from "react-native-toast-message";

export default function AutomationInfoModal({
  modalVisible,
  setModalVisible,
  currentAutomation,
  onDeleted,
}) {
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const [deleteModal, setDeleteModal] = useState(false);
  if (!currentAutomation) return null;

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAutomation(currentAutomation.id);

      Toast.show({
        type: "success",
        text1: "Automation Deleted",
        text2: `${currentAutomation.ruleName} has been deleted.`,
        topOffset: 60,
        swipeable: true,
      });

      setDeleteModal(false);
      setTimeout(() => {
        setModalVisible(false);
      }, 500);

      if (onDeleted) {
        onDeleted();
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: "Something went wrong. Try again.",
        topOffset: 60,
      });
    }
  };
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
          <Text style={styles.autoName}>
            {currentAutomation?.ruleName || " "}
          </Text>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <AutomationDetails currentAutomation={currentAutomation} />
          </ScrollView>

          <FooterButtons
            handleCloseModal={handleCloseModal}
            showDelete={true}
            handleDelete={handleDelete}
          />
        </View>
      </View>

      <ConfirmationModal
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => {
          handleConfirmDelete();
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
