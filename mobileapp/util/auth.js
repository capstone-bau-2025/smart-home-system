import axios from "axios";
import { AppState, Platform } from "react-native";
import * as Network from "expo-network";
import { store } from "../store/store";
const LOCAL_IP = "192.168.1.36";
const BASE_LOCAL_IP = Platform.OS === "android" ? "10.0.2.2" : LOCAL_IP;

export const LOCAL_URL = `http://${BASE_LOCAL_IP}:8080/`; // hub
export const BASE_URL = `http://${BASE_LOCAL_IP}:8082/`; // cloud

let ACTIVE_URL = LOCAL_URL;
let pingInterval = null;

//Determine base URL based on connection type (wifi or not)
// export async function getActiveBaseUrl() {
//   try {
//     const networkState = await Network.getNetworkStateAsync();
//     console.log('NETWORK STATE:', networkState);
//     const isWifi = networkState?.type === Network.NetworkStateType.WIFI;
//     console.log(networkState)
//     const selectedUrl = isWifi ? LOCAL_URL : BASE_URL;

//     console.log("📡 Network type:", networkState.type);
//     console.log("🌐 ACTIVE_URL determined as:", selectedUrl);

//     return selectedUrl;
//   } catch (err) {
//     console.error("❌ Failed to determine network type:", err.message);
//     return BASE_URL;
//   }
// } 

export async function getActiveUrl() {
  const token = store.getState().user.localToken;
  try {
    await axios.get(`http://192.168.1.36:8080/api/hub/discover`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
      timeout: 60000,
    });
    console.log("ACTIVE_URL set to LOCAL:", LOCAL_URL);
    return LOCAL_URL;
  } catch (err) {
    try {
      await axios.get(`${BASE_URL}`);
      console.log("ACTIVE_URL set to CLOUD:", BASE_URL);
      return BASE_URL;
    } catch (error) {
      console.error("❌ Both LOCAL and BASE URLs failed.");
      return null;
    }
  }
}

export function stopActiveUrlMonitor() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}

export function startActiveUrlMonitor(onUrlChange, intervalMs = 60000) {
  const checkAndUpdateUrl = async () => {
    try {
      const newUrl = await getActiveUrl();
      if (newUrl && newUrl !== ACTIVE_URL) {
        ACTIVE_URL = newUrl;
        console.log("🌐 ACTIVE_URL updated to:", newUrl);
        if (onUrlChange) onUrlChange(newUrl);
      }
    } catch (e) {
      console.warn("⚠️ Failed to update ACTIVE_URL:", e.message);
    }
  };

  const handleAppStateChange = (nextAppState) => {
    console.log("App is now:", nextAppState);
    if (nextAppState === "active") {
      if (!pingInterval) {
        checkAndUpdateUrl();
        pingInterval = setInterval(checkAndUpdateUrl, intervalMs);
      }
    } else {
      stopActiveUrlMonitor();
    }
  };

  AppState.addEventListener("change", handleAppStateChange);

  checkAndUpdateUrl();
  pingInterval = setInterval(checkAndUpdateUrl, intervalMs);
}

export { ACTIVE_URL };
