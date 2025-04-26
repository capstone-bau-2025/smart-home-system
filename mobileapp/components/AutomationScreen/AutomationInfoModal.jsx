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

//modal that is shown when user clicked on the automation card
export default function AutomationInfoModal({
  modalVisible,
  setModalVisible,
  currentAutomation,
  navigation,
}) {
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleEdit = () => {
    setModalVisible(false);
    navigation.navigate("ConfigureAutomation", {
      currentAutomation: currentAutomation,
    });
  };

  if (!currentAutomation) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="fade"
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.autoName}>{currentAutomation.name}</Text>

              <ScrollView style={styles.scrollContainer}>
                <AutomationDetails currentAutomation={currentAutomation} />
              </ScrollView>
              <FooterButtons
                handleCloseModal={handleCloseModal}
                handleEdit={handleEdit}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    height: "55%",
    backgroundColor: "#C4C4C4",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  autoName: {
    fontSize: 30,
    fontFamily: "Lexend-Bold",
    marginBottom: 10,
  },
  scrollContainer: {
    width: "100%",
    maxHeight: "80%",
  },
});
