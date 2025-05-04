import axios from "axios";
import { AppState, Platform } from "react-native";

const LOCAL_IP = "192.168.1.62";
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
    if (ACTIVE_URL !== LOCAL_URL) {
      console.log("✅ Switched to LOCAL_URL:", LOCAL_URL);
      ACTIVE_URL = LOCAL_URL;
    }
    return LOCAL_URL;
  } catch (err) {
    console.warn("❌ LOCAL_URL unreachable:", err.message);
  }

  try {
    const res = await axios.get(BASE_URL, {
      timeout: 1500,
      validateStatus: (status) => status === 200 || status === 403,
    });
    if (ACTIVE_URL !== BASE_URL) {
      console.log("☁️ Switched to BASE_URL:", BASE_URL);
      ACTIVE_URL = BASE_URL;
    }
    return BASE_URL;
  } catch (err) {
    console.warn("❌ BASE_URL unreachable:", err.message);
  }

  console.error("❌ No available server. LOCAL and BASE URLs both failed.");
  ACTIVE_URL = null;
  throw new Error("No available server.");
}

// Start periodic monitoring (use on app load)
//100000
export function startActiveUrlMonitor(intervalMs = 10000) {
  const checkAndUpdateUrl = async () => {
    console.log("🔄 Pinging LOCAL_URL and BASE_URL to update ACTIVE_URL...");
    try {
      await getActiveBaseUrl();
    } catch (e) {
      console.warn("⚠️ Failed to update ACTIVE_URL:", e.message);
    }
  };

  const handleAppStateChange = (nextAppState) => {
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

  // Start immediately
  checkAndUpdateUrl();
  pingInterval = setInterval(checkAndUpdateUrl, intervalMs);
}

// Stop monitoring manually if needed
export function stopActiveUrlMonitor() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}

export { ACTIVE_URL };
