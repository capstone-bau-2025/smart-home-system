import SVGS from "../components/svg/SVGS";
import AuthForm from "../components/authentication/AuthForm";
import AuthFooter from "../components/authentication/AuthFooter"
import DismissKeyboard from "../components/utils/DismissKeyboard";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoginScreen({ navigation, screensHandler }) {



  const {login,authStatus} = useContext(AuthContext);
  
  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <SVGS />
        <View style={styles.formContainer}>
          <Text style={styles.appName}>Smart Home</Text>
          <Text style={styles.title2}>Sign in to your account</Text>
        </View>
        <AuthForm screensHandler={screensHandler} login={login} authStatus={authStatus} />
        <AuthFooter navigation={navigation} />
      </SafeAreaView>
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
});

/*     <KeyboardAvoidingView
behavior={Platform.OS === "ios" ? "padding" : "height"} 
style={styles.container}
>*/
