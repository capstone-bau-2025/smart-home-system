import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import SVGS from "../components/svg/SVGS";
import RegForm from "../components/authentication/RegForm";
import DismissKeyboard from "../components/utils/DismissKeyboard";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);


  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <SVGS/>
          <Text style={styles.appName}>Create an account</Text>
      <RegForm register={register} />
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
    textAlign: "left",
    
    color: "black",
    fontSize: 35,
    marginBottom: 10,
    fontFamily: "Lexend-Bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 }, 
    textShadowRadius: 4, 
    marginTop: -100,
  },


});
