import axios from "axios";
import { Platform } from "react-native";

const LOCAL_IP = "192.168.1.62";
const BASE_LOCAL_IP = Platform.OS === "android" ? "10.0.2.2" : LOCAL_IP;

export const LOCAL_URL = `http://${BASE_LOCAL_IP}:8080/`;
export const BASE_URL = `http://${BASE_LOCAL_IP}:8082/`;

let ACTIVE_URL = null;

export async function getActiveBaseUrl() {
  try {
    const res = await axios.get(LOCAL_URL, {
      timeout: 1500,
      validateStatus: (status) => status === 200 || status === 403,
    });
    console.log("========================================================");
    console.log("✅ LOCAL_URL is available: ", LOCAL_URL);
    console.log("========================================================");
    ACTIVE_URL = LOCAL_URL;
    return LOCAL_URL;
  } catch (err) {
    console.warn("❌ LOCAL_URL unreachable: ", err.message);
  }

  try {
    const res = await axios.get(BASE_URL, {
      timeout: 1500,
      validateStatus: (status) => status === 200 || status === 403,
    });
    console.log("========================================================");
    console.log("☁ CLOUD URL is available, Active URL is ", BASE_URL);
    console.log("========================================================");
    ACTIVE_URL = BASE_URL;
    return BASE_URL;
  } catch (err) {
    console.warn("❌ BASE_URL unreachable: ", err.message);
  }


  console.error("❌ No available server. LOCAL and BASE URLs both failed.");
  ACTIVE_URL = null;
  throw new Error("❌ No available server. LOCAL and BASE URLs both failed.");
}

export { ACTIVE_URL };
