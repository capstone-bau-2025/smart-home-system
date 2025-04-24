import { useState, useEffect } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import OvalButton from "../UI/OvalButton";  
import AuthInput from "../UI/AuthInput";

//holds the login form and handles the login process (will be changed to formik later)
export default function AuthForm({ login, authStatus }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    let newErrors = { email: "", password: "" };

    if (!email) newErrors.email = "Email is required to login";
    if (!password) newErrors.password = "Password is required to login";

    setErrors(newErrors);


    if (!newErrors.email && !newErrors.password) {
      login(email, password);
    }


  };

  useEffect(() => {
    if (authStatus === 403) {
      setErrors({
        email: " ",
        password: "Incorrect email or password ",
      });
    }
  }, [authStatus]); // Runs whenever authStatus changes

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
        autoCapitalize="none"
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
  },  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
