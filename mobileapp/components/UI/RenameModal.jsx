import { StyleSheet, View } from "react-native";
import MidModal from "./MidModal";
import EditInput from "./EditInput";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  inputValue: Yup.string()
    .required("This field is required")
    .min(4, "Must be at least 4 characters"),
});

export default function RenameModal({
  visible,
  setVisible,
  value,
  setValue,
  title,
  placeholder,
  onConfirm,
}) {
  const [error, setError] = useState("");

  const handleConfirmPress = async () => {
    try {
      await validationSchema.validate({ inputValue: value });
      setError(""); 
      onConfirm(value);
      setVisible(false);
    } catch (validationError) {
      setError(validationError.message); 
    }
  };

  return (
    <MidModal
      visible={visible}
      onClose={() => setVisible(false)}
      buttons={true}
      cancelLabel="Cancel"
      confirmLabel="Save"
      onConfirm={handleConfirmPress}
    >
      <View style={styles.container}>
        <EditInput
          value={value}
          setChange={setValue}
          title={title}
          placeholder={placeholder}
          error={error}
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
