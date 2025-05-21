import axios from "axios";
import { LOCAL_URL } from "../../util/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../../store/store";
import getCurrentUrl from "../../util/helperUrl";

export const generateInviteCode = async (roleId) => {
  const currentUrl = getCurrentUrl();
  try {
    const token = await AsyncStorage.getItem("userToken");
    const endpoint = `${currentUrl}api/invitations?roleId=${roleId}`;

    const response = await axios.post(endpoint, null, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
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
