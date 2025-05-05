import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getActiveBaseUrl } from "../../util/auth";
import { LOCAL_URL } from "../../util/auth";
import { store } from "../../store/store";

export const discoverDevices = async () => {

  
  
  try{
    const localToken = store.getState().user.localToken;
    const res = await axios.get(`${LOCAL_URL}api/device-discovery`,{
  
      // params: { hubSerialNumber, },
      headers: {
        Authorization: `Bearer ${localToken}`,
        Accept: 'application/json',
        
      },
  
    }
  );

    return res.data;
    
  }

  catch (error) {
    console.error("Error discovering devices: ", error);
    throw error;
  }

}
