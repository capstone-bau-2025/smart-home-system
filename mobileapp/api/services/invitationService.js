import axios from "axios";
import { LOCAL_URL } from "../../util/auth"; // or BASE_URL depending on your setup
import AsyncStorage from "@react-native-async-storage/async-storage";

const path = `${LOCAL_URL}api/invitations/`;

export const createInvitation = async (roleId) => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.post(`${path}?roleId=${roleId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};
