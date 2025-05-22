import axios from "axios";
import { store } from "../../store/store";
import { LOCAL_URL } from "../../util/auth";
import getCurrentUrl from "../../util/helperUrl";
import getAuthToken from "../../util/getAuthToken";

export const getAllCameras = async () => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.get(`${currentUrl}api/cameras/get-all`, {
    headers: {
      Authorization: `Bearer ${fetchedToken}`,
    },
    params: {
      hubSerialNumber: hubSerialNumber,
    },
  });

  return response.data; 
};

export const streamCameraById = async (cameraId) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.get(`${currentUrl}api/cameras/${cameraId}/stream`, {
    headers: {
      Authorization: `Bearer ${fetchedToken}`,
    },
    params: {
      hubSerialNumber: hubSerialNumber,
    },
  });

  return response.data;
};
