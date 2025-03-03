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

  
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <View style={styles.errorPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 10,
    alignSelf: "center", 
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
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Lexend-Regular",
    textAlign: "left",
    width: 311, 
    marginTop: 2,
    
  },
  errorPlaceholder: {
    height: 15, 
    width: 311, 
  },
});
