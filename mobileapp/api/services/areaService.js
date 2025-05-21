import axios from "axios";
import { LOCAL_URL } from "../../util/auth";
import { store } from "../../store/store";
import { BASE_URL } from "../../util/auth";
import getCurrentUrl from "../../util/helperUrl";
const path = `${LOCAL_URL}api/areas/`;
const cloudPath = `${BASE_URL}api/areas/`;

export const addRoom = async (areaName, iconID, hubSerialNumber) => {
  const localToken = store.getState().user.localToken;
  const currentUrl = getCurrentUrl();
  const activePath = `${currentUrl}api/areas/`;

  const response = await axios.post(
    `${activePath}add?areaName=${areaName}&iconId=${iconID}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localToken}`,
      },
      params: {
        hubSerialNumber,
      },
    }
  );
  return response.data;
};

export const getAllRooms = async (hubSerialNumber) => {
  const localToken = store.getState().user.localToken;
  const currentUrl = getCurrentUrl();
  const activePath = `${currentUrl}api/areas/`;

  // console.log("ACTIVE PATH:", activePath);
  // console.log('LOCAL TOKEN:', localToken);
  const response = await axios.get(`${activePath}get-all`, {
    params: { hubSerialNumber },
    headers: {
      Authorization: `Bearer ${localToken}`,
    },
  });
  return response.data;
};

export const deleteRoom = async (areaId, hubSerialNumber) => {
  const localToken = store.getState().user.localToken;
  const currentUrl = getCurrentUrl();
  const activePath = `${currentUrl}api/areas/`;

  const response = await axios.delete(`${activePath}${areaId}`, {
    params: { hubSerialNumber },
    headers: {
      Authorization: `Bearer ${localToken}`,
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
