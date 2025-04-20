import { StyleSheet, Text, View } from "react-native";
import MidModal from "./MidModal";
import EditInput from "./EditInput";
import { useState } from "react";
export default function RenameModal({ visible, setVisible, value, setValue, title,placeholder}) {

  return (
    <MidModal
      visible={visible}
      onClose={() => setVisible(false)}
      buttons={true}
      cancelLabel={"Cancel"}
      confirmLabel={"Save"}
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
