import axios from "axios";
import { store } from "../../store/store";
import { LOCAL_URL } from "../../util/auth";

export const getAllCameras = async (hubSerialNumber) => {
  const localToken = store.getState().user.localToken;

  console.log(localToken)

  const response = await axios.get(`${LOCAL_URL}api/cameras/get-all`, {
    headers: {
      Authorization: `Bearer ${localToken}`,
      parameter: hubSerialNumber,
    },
  });

  return response.data; 
};

export const streamCameraById = async (cameraId) => {
  const localToken = store.getState().user.localToken;

  const response = await axios.get(`${LOCAL_URL}api/cameras/${cameraId}/stream`, {
    headers: {
      Authorization: `Bearer ${localToken}`,
    },
  });

  return response.data;
};
