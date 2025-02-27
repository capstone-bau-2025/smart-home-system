import { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import OvalButton from "../UI/OvalButton";
import AuthInput from "../UI/AuthInput";

export default function AuthForm({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to store validation errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    let newErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required!";
    if (!password) newErrors.password = "Password is required!";

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password) {
      login(email, password);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Email Input */}
      <AuthInput
        placeholder="Enter your email"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        errorMessage={errors.email}
      />

      {/* Password Input */}
      <AuthInput
        placeholder="Enter your password"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        errorMessage={errors.password}
      />

      {/* Login Button */}
      <OvalButton text="Login" color="black" onPress={handleLogin} />

      {/* Forgot Password */}
      <Pressable onPress={() => console.log("forgot pass")} style={({ pressed }) => [styles.forgotPass, pressed && styles.pressed]}>
        <Text style={styles.forgotPass}>Forgot Password?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  forgotPass: {
    textDecorationLine: "underline",
    marginTop: 7.5,
    textAlign: "center",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#000000",
  },
  pressed: {
    opacity: 0.7,
  },
});
