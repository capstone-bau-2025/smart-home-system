import { StyleSheet, Text, View } from "react-native";
import MidModal from "./MidModal";
import EditInput from "./EditInput";
import { useState } from "react";
//a component for renaming, opens a small modal with text input and a save + cancel buttons
export default function RenameModal({ visible, setVisible, value, setValue, title,placeholder,onConfirm }) {

  return (
    <MidModal
      visible={visible}
      onClose={() => setVisible(false)}
      buttons={true}
      cancelLabel={"Cancel"}
      confirmLabel={"Save"}
      onConfirm={() => onConfirm(value)} 
    >
      <View style={styles.container}>
        <EditInput

          setChange={setValue}
          value={value}
          title={title}
          placeholder={placeholder}

        />
      </View>
    </MidModal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
