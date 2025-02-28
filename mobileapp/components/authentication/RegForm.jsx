import { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import OvalButton from "../UI/OvalButton";
import { AuthContext } from "../../store/auth-context";
import AuthInput from "../UI/AuthInput";

export default function RegForm({register}) {


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation regex patterns
  const usernameRegex = /^[a-zA-Z0-9_]{8,20}$/; // No special characters, only letters, numbers, and underscores
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d]{8,}$/; // At least 8 chars, 1 uppercase, NO special characters

  const handleRegister = () => {
    let newErrors = { username: "", email: "", password: "", confirmPassword: "" };
  

    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com","bahcesehir.edu.tr"];
    const emailParts = email.split("@");
  
    
    if (!username) newErrors.username = "Username is required!";
    else if (!usernameRegex.test(username))
      newErrors.username = "Username must be 8-20 characters, can only contain letters, numbers, and _ ";
  

    if (!email) {
      newErrors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email (e.g., user@example.com).";
    } else if (!allowedDomains.includes(emailParts[1])) {
      newErrors.email = "Only @gmail.com, @yahoo.com, @outlook.com, @hotmail.com, and @bahcesehir.edu.tr domains are allowed";
    }
  

    if (!password) newErrors.password = "Password is required!";
    else if (!passwordRegex.test(password))
      newErrors.password = "Must be 8+ characters, at least 1 uppercase letter and has no special characters ";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
  
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      register(username, email, password);
    }
  };
  

  return (
    <View style={styles.formContainer}>
      <AuthInput
        placeholder="Enter your username"
        icon="person-outline"
        value={username}
        onChangeText={setUsername}
        errorMessage={errors.username}
      />

      <AuthInput
        placeholder="Enter your email"
        icon="mail-outline"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        errorMessage={errors.email}
      />

      <AuthInput
        placeholder="Enter your password"
        icon="lock-closed-outline"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        errorMessage={errors.password}
      />

      <AuthInput
        placeholder="Confirm your password"
        icon="lock-closed-outline"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        errorMessage={errors.confirmPassword}
      />

      <OvalButton text="Register" color="black" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    justifyContent:'center',
    alignContent:'center'
  },
});
