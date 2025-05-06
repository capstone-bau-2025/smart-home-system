import axios from "axios";
import { AppState, Platform } from "react-native";

const LOCAL_IP = "192.168.1.62"; //change this to whaterever expo is running on 
const BASE_LOCAL_IP = Platform.OS === "android" ? "10.0.2.2" : LOCAL_IP;

export const LOCAL_URL = `http://${BASE_LOCAL_IP}:8080/`;
export const BASE_URL = `http://${BASE_LOCAL_IP}:8082/`;

let ACTIVE_URL = null;
let pingInterval = null;

// Get current active URL (tries local first, then fallback to cloud)
export async function getActiveBaseUrl() {
  try {
    const res = await axios.get(LOCAL_URL, {
      timeout: 1500,
      validateStatus: (status) => status === 200 || status === 403,
    });
    console.log("✅ LOCAL_URL reachable");
    return LOCAL_URL;
  } catch (err) {
    console.warn("❌ LOCAL_URL unreachable:", err.message);
  }

  try {
    const res = await axios.get(BASE_URL, {
      timeout: 1500,
      validateStatus: (status) => status === 200 || status === 403,
    });
    console.log("☁️ BASE_URL reachable");
    return BASE_URL;
  } catch (err) {
    console.warn("❌ BASE_URL unreachable:", err.message);
  }

  console.error("❌ No available server. LOCAL and BASE URLs both failed.");
  return null;
}

export function stopActiveUrlMonitor() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}
// Start periodic monitoring (use on app load)
//100000
export function startActiveUrlMonitor(onUrlChange, intervalMs = 10000) {
  const checkAndUpdateUrl = async () => {
    try {
      const newUrl = await getActiveBaseUrl();
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
    console.log("📱 App is now:", nextAppState); 

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
