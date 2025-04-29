import axios from "axios";
import { LOCAL_URL } from "../../util/auth"; 
import AsyncStorage from "@react-native-async-storage/async-storage";




const path = `${LOCAL_URL}api/hub/`;

export const discoverHubs = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${path}discover`, {

    });

    console.log(response.data)
    return response.data; 
  } catch (error) {
    console.error("Error discovering hubs:", error);
    throw error;
  }
};


export const fetchHubs = async () => {
  try {
    const hubsData = await discoverHubs();
    return { data: hubsData };
  } catch (error) {
    console.log("Error fetching hubs:", error);
    return { error };
  }
};




export const configureHub = async (hubName) => {
  try {
    // const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(
      `${path}configure`,
      { hubName },
    );
    return response.data; 
  } catch (error) {
    console.error("Error configuring hub:", error);
    throw error; 
  }
};


export const updateHubName = async (name) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.put(
      `${path}update-name?name=${name}`,  
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error updating hub name:", error);
    throw error; 
  }
};