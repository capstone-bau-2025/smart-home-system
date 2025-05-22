import axios from "axios";
import { LOCAL_URL } from "../../util/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../../store/store";
import getCurrentUrl from "../../util/helperUrl";
import getAuthToken from "../../util/getAuthToken";

export const generateInviteCode = async (roleId) => {
  const currentUrl = getCurrentUrl();
  try {
    const fetchedToken = getAuthToken();
    const endpoint = `${currentUrl}api/invitations?roleId=${roleId}`;
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;

    const response = await axios.post(endpoint, null, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${fetchedToken}`,
      },
      params: {
        hubSerialNumber: hubSerialNumber,
      },
    });

    console.log("Invitation code generated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to generate invite code:",
      error.response?.data || error.message
    );
    throw error;
  }
};
