import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import AutomationDetails from "../../components/AutomationScreen/AutomationDetails";
import ModalButtons from "../../components/AutomationScreen/FooterButtons";
import { useState } from "react";
import TypeModal from "../../components/AutomationScreen/TypeModal";

export default function ConfigureAutomation({ route,navigation }) {
  const { currentAutomation } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [name, setName] = useState(currentAutomation.name ?? "");
  const [description, setDescription] = useState(
    currentAutomation.description ?? ""
  );
  const [type, setType] = useState(currentAutomation.type ?? "");
  const [action, setAction] = useState(currentAutomation.action ?? "");
  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <AutomationDetails
            currentAutomation={currentAutomation}
            edit={true}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            type={type}
            setType={setType}
            action={action}
            setAction={setAction}
            setModalVisible={setModalVisible}
            navigation={navigation}
          />
          <ModalButtons edit={true} />
        </View>
      </ScrollView>

      <TypeModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSelect={(type) => {
          setSelectedType(type);
          navigation.navigate(type)
        }}
        navigation={navigation}
        selectedType={selectedType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  innerContainer: {
    width: "90%",
  },
});
