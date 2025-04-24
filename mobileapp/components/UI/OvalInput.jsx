import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

//a simple oval shaped text input, used in register and login screens 
export default function OvalInput({
  placeholder,
  icon,
  value,
  onChangeText,
  keyboardType = "default",
  password = false,

}) {
  const [hidden, setHidden] = useState(password);
  
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={20} color="#ffffff" style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#ffffff"
        keyboardType={keyboardType}
        secureTextEntry={hidden}
        value={value} 
        onChangeText={onChangeText} 
      />

      {password && (
        <Pressable
          style={({ pressed }) => [
            styles.passIconContainer,
            pressed && styles.pressed,
          ]}
          onPress={() => setHidden(!hidden)}
        >
          <Ionicons
            name={hidden ? "eye-outline" : "eye-off-outline"} 
            size={20}
            color="#ffffff"
            style={styles.passIcon}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: 311,
    height: 48,
    backgroundColor: Colors.primary100,
    borderRadius: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Lexend-Regular",
    textAlign:'left'
  },
  passIconContainer: {
    padding: 5,
  },
  passIcon: {
    alignSelf: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
