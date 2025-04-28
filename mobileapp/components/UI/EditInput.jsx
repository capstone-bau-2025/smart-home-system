import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import * as Yup from "yup"; // Import Yup

// Define the validation schema (just required)
const validationSchema = Yup.object({
  inputValue: Yup.string().required("This field is required"),  // Only required validation
});

export default function EditInput({
  value,
  placeholder,
  setChange,
  title,
  validationMessage,
}) {
  const [error, setError] = useState("");

  
  useEffect(() => {
  
    validationSchema
      .validate({ inputValue: value })
      .then(() => setError(""))  
      .catch(() => setError("This field is required"));
  }, [value]); 

  return (
    <>
      <Text style={styles.infoText}>{title}</Text>
      <View style={styles.propContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>


      {error && (
        <Text style={styles.validationText}>{error}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  propContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    width: "100%",
  },
  input: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    textAlignVertical: "top",
    minWidth: "90%",
    maxWidth: "90%",
  },
  infoText: {
    fontFamily: "Lexend-Bold",
    fontSize: 20,
    marginBottom: 3,
    marginLeft: 5,
  },
  validationText: {
    fontSize: 14,
    color: "red",
    marginLeft: 15,
    alignSelf: "flex-start",

  },
});
