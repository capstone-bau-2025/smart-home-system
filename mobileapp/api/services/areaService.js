import axios from "axios";
import { LOCAL_URL } from "../../util/auth";
import { store } from "../../store/store";
import { BASE_URL } from "../../util/auth";
import getCurrentUrl from "../../util/helperUrl";
import getAuthToken from "../../util/getAuthToken";

const path = `${LOCAL_URL}api/areas/`;
const cloudPath = `${BASE_URL}api/areas/`;

export const addRoom = async (areaName, iconID,) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const activePath = `${currentUrl}api/areas/`;
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.post(
    `${activePath}add?areaName=${areaName}&iconId=${iconID}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${fetchedToken}`,
      },
      params: {
        hubSerialNumber,
      },
    }
  );
  return response.data;
};

export const getAllRooms = async () => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const activePath = `${currentUrl}api/areas/`;
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.get(`${activePath}get-all`, {
    params: { hubSerialNumber },
    headers: {
      Authorization: `Bearer ${fetchedToken}`,
    },
  });
  return response.data;
};

export const deleteRoom = async (areaId, hubSerialNumber) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const activePath = `${currentUrl}api/areas/`;
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.delete(`${activePath}${areaId}`, {
    params: { hubSerialNumber },
    headers: {
      Authorization: `Bearer ${fetchedToken}`,
    },
  });
  return response.data;
};

export const fetchAreas = async (hubSerialNumber) => {
  
  try {
    const roomsData = await getAllRooms(hubSerialNumber);
    return { data: roomsData };
  } catch (error) {
    console.log("Error fetching rooms:", error);
    return { error };
  }
};
