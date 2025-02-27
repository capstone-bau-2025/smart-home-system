import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Colors from "../../constants/Colors";

export default function AuthInput({ 
  placeholder, 
  icon, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  keyboardType = "default",
  errorMessage,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.inputWrapper}>
      {/* Input Field */}
      <View style={[styles.inputContainer, errorMessage ? styles.errorBorder : null]}>
        <Ionicons name={icon} size={20} color="#ffffff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#ffffff"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <Pressable style={styles.passIconContainer} onPress={() => setHidden(!hidden)}>
            <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={20} color="#ffffff" />
          </Pressable>
        )}
      </View>

      {/* Fixed Space for Error Message */}
      <View style={styles.errorContainer}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 10,
    justifyContent:'center',
    alignContent:'center'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 311,
    height: 48,
    backgroundColor: Colors.primary100,
    borderRadius: 50,
    paddingHorizontal: 15,
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Lexend-Regular",
    textAlign: "left",
  },
  passIconContainer: {
    padding: 5,
  },
  errorContainer: {
    height: 15,  // Ensures space is always reserved for error messages // Matches input width for alignment
    justifyContent: "center",  // Centers text vertically
    alignItems: "flex-start",  // Aligns text to left
  },
  
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Lexend-Regular",

  },
});
