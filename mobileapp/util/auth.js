import axios from "axios";
import { Platform } from "react-native";


const LOCAL_IP = "192.168.1.38";

export const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8082/" // Android Emulator
  
    // ? "http://localhost:8082/" // iOS Simulator
    : `http://${LOCAL_IP}:8082/`; // Real device (IOS)



// async function authenticate(mode, email, password) {


//   const response = await axios.post(url, {
//     email: email,
//     password: password,
//     returnSecureToken: true,
//   });

//   const token = response.data.idToken;
//   return token;
// }



// export  function login(email, password) {
//   return authenticate('signInWithPassword', email, password);
// }