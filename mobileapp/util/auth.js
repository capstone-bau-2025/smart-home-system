import axios from "axios";
import { Platform } from "react-native";


const LOCAL_IP = "192.168.1.55";


export const LOCAL_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080/" 
    : `http://${LOCAL_IP}:8080/`; 

    
export const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8082/" // Android Emulator
  
    // ? "http://localhost:8082/" // iOS Simulator
    : `http://${LOCAL_IP}:8082/`; 


 