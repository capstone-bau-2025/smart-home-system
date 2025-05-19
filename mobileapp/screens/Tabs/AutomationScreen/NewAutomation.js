import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AutomationDetails from "../../../components/AutomationScreen/AutomationDetails";
import FooterButtons from "../../../components/AutomationScreen/FooterButtons";
import TypeModal from "../../../components/AutomationScreen/TypeModal";
import Colors from "../../../constants/Colors";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
export default function NewAutomation({ route, navigation }) {
  const { currentAutomation } = route.params || {};

  const savedType = useSelector((state) => state.automation.type);
  const storedSelectedTime = useSelector((state) => state.automation.selectedTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [action, setAction] = useState("");
  const [cd, setCd] = useState("");

  return (
    <>
      <View style={styles.container}>
        <AutomationDetails
          currentAutomation={"aaa"}
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
          setCooldown={setCd}
          cooldownDuration={cd}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <FooterButtons
          handleCloseModal={() => navigation.goBack()}
          handleSave={() => {
            setSelectedType(savedType);
            
            if (
              !name.trim() ||
              !description.trim() ||
              !type ||
              // !action ||
              !cd.trim()
            ) {
              Toast.show({
                type: "error",
                text1: "Can't create automation",
                text2: "Please fill all fields",
                position: "top",
                swipeable: true,
                topOffset: 60,
              });
              return;
            }

            console.log(
              `Name: ${name}, Description: ${description}, Type: ${type}, Action: ${action}, Cooldown: ${cd}`
            );
          }}
          create={true}
          hideClose={true}
        />
      </View>

      <TypeModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSelect={(type) => {
          setSelectedType(type);
          navigation.navigate(type);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: Colors.primaryBackground,
  },
});
