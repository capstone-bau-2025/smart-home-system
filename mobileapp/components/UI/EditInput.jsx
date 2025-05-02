import { StyleSheet, Text, View, TextInput } from "react-native";

export default function EditInput({
  value,
  placeholder,
  setChange,
  title,
  error, // now purely controlled from outside
}) {
  return (
    <>
      {title && <Text style={styles.infoText}>{title}</Text>}
      <View style={styles.propContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>

      {error ? <Text style={styles.validationText}>{error}</Text> : null}
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
