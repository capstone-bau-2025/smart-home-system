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
export default function RegisterScreen({ navigation }) {
  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <SVGS/>
        <View style={styles.formContainer}>
          <Text style={styles.appName}>Create an account</Text>

          <OvalInput placeholder="Enter your username" icon="person-outline" />
          <OvalInput placeholder="Enter your email" icon="mail-outline" />
          <OvalInput
            placeholder="Enter your password"
            icon="lock-closed-outline"
            secureTextEntry={true}
            password={true}
          />
          <OvalButton text={"Register"} color="black" />
          {/* <Pressable
            onPress={() => navigation.navigate("Login")}
            style={({ pressed }) =>
              pressed
                ? [styles.forgotPass, styles.pressed]
                : [styles.forgotPass]
            }
          >
            <Text style={styles.login1}>
              Already have an account? <Text style={styles.login2}>Login</Text>
            </Text>
          </Pressable> */}
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
    textAlign: "left",

    color: "black",
    fontSize: 30,
    marginBottom: 10,
    fontFamily: "Lexend-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)", // 25% opacity
    textShadowOffset: { width: 0, height: 4 }, // X = 0, Y = 4
    textShadowRadius: 4, // Blur = 4
  },

  formContainer: {
    marginTop: -100,
  },
  login1: {
    marginTop: 15,
    textAlign: "center",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#000000",
  },
  pressed: {
    opacity: 0.7,
  },
  login2: {
    textDecorationLine: "underline",
    fontFamily: "Lexend-Regular",
    color: Colors.primary100,
  },
  footer: {
    position: "absolute",
    bottom: 30,
  },
});
