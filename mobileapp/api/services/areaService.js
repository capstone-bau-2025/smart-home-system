import axios from "axios";
import { BASE_URL } from "../../util/auth";
import { LOCAL_URL } from "../../util/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const path = `${LOCAL_URL}api/areas/`;


export const addRoom = async (areaName) => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.post(`${path}add?areaName=${areaName}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// export const addRoom = async (areaName) => {
//   const response = await axios.post(`${path}add?areaName=${areaName}`);
//   return response.data;
// };

export const getAllRooms = async () => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.get(`${path}get-all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const deleteRoom = async (areaId) => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.delete(`${path}${areaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const fetchRooms = async () => {
  try {
    const roomsData = await getAllRooms();
    return {  data: roomsData };
  } catch (error) {
    console.log("Error fetching rooms:", error);
    return {  error };
  }
};
