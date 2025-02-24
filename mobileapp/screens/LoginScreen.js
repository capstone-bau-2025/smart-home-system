import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import OvalInput from "../components/UI/OvalInput";
import OvalButton from "../components/UI/OvalButton";
import Colors from "../constants/Colors";
import SVGS from "../components/svg/SVGS";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
    accessible={false}
  >
    {children}
  </TouchableWithoutFeedback>
);

export default function LoginScreen({ navigation, screensHandler }) {
  return (
    <DismissKeyboard>
      <View style={styles.container}>
      <SVGS/>
        <View style={styles.formContainer}>
          <Text style={styles.appName}>Smart Home</Text>
          <Text style={styles.title2}>Sign in to your account</Text>
          <OvalInput placeholder="Enter your email" icon="mail-outline" />
          <OvalInput
            placeholder="Enter your password"
            icon="lock-closed-outline"
            secureTextEntry={true}
            password={true}
          />
          <OvalButton text={"Login"} color="black" onPress={screensHandler} />
          <Pressable
            onPress={() => console.log("forgot pass")}
            style={({ pressed }) =>
              pressed
                ? [styles.forgotPass, styles.pressed]
                : [styles.forgotPass]
            }
          >
            <Text style={styles.forgotPass}>Forgot Password?</Text>
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={({ pressed }) => (pressed ? [styles.pressed] : " ")}
          >
            <Text style={styles.signup1}>
              Don't have an account?{" "}
              <Text style={styles.signupText}>Signup</Text>
            </Text>
          </Pressable>
        </View>
  
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    textAlign: "center",
    color: "black",
    fontSize: 48,
    fontFamily: "Lexend-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)", 
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4, 
  },
  title2: {
    fontSize: 16,
    fontFamily: "Lexend-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    marginTop: -100,
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
  signupText: {
    textDecorationLine: "underline",
    fontFamily: "Lexend-Regular",
    color: Colors.primary100,
    fontSize: 17,
  },
  signup1: {
    fontSize: 17,
    fontFamily: "Lexend-Regular",
  },
  footer: {
    position: "absolute",
    bottom: 30,
  },
});

/*     <KeyboardAvoidingView
behavior={Platform.OS === "ios" ? "padding" : "height"} 
style={styles.container}
>*/
