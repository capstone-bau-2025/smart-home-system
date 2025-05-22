import axios from "axios";
import { store } from "../../store/store";
import getCurrentUrl from "../../util/helperUrl";
import { setDevices } from "../../store/slices/devicesSlice";
import getAuthToken from "../../util/getAuthToken";

export const getDeviceByArea = async (areaId, hubSerialNumber) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const response = await axios.get(
    `${currentUrl}api/devices/by-area/${areaId}`,
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

export const updateDeviceName = async (deviceId, newName) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.put(
    `${currentUrl}api/devices/${deviceId}/name`,
    {},
    {
      params: { name: newName, hubSerialNumber },
      headers: { Authorization: `Bearer ${fetchedToken}` },
    }
  );
  return response.data;
};

export const updateDeviceArea = async (
  deviceId,
  areaId,
  token,
  hubSerialNumber
) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const response = await axios.put(
    `${currentUrl}api/devices/${deviceId}/area`,
    {},
    {
      params: { areaId, hubSerialNumber },
      headers: {
        Authorization: `Bearer ${fetchedToken}`,
      },
    }
  );
  return response.data;
};

export const pingDevice = async (deviceId, token, hubSerialNumber) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const response = await axios.get(
    `${currentUrl}api/devices/${deviceId}/ping`,
    {
      headers: {
        Authorization: `Bearer ${fetchedToken}`,
      },
      params: {
        hubSerialNumber,
      },
    }
  );
  return response;
};

export const deleteDevice = async (deviceId, token) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const response = await axios.delete(`${currentUrl}api/devices/${deviceId}`, {
    headers: {
      Authorization: `Bearer ${fetchedToken}`,
    },
    params: {
      hubSerialNumber,
    },
  });
  return response.data;
};

export const fetchAndDispatchDevices = async (
  hubSerialNumber,
  areas,
  dispatch
) => {
  if (!hubSerialNumber || !areas?.length) return;

  try {
    const deviceMetaPerArea = await Promise.all(
      areas.map((area) =>
        getDeviceByArea(area.areaId, hubSerialNumber).then((list) => ({
          areaId: area.areaId,
          list,
        }))
      )
    );

    const allDevices = deviceMetaPerArea.flatMap(({ areaId, list }) =>
      list.map((device) => ({ ...device, areaId }))
    );

    dispatch(setDevices(allDevices));
  } catch (err) {
    console.error("❌ Error fetching devices per area:", err);
  }
};

export const fetchDeviceByFilter = async (filter) => {
  try {
    const fetchedToken = getAuthToken();
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
    const currentUrl = getCurrentUrl();
    console.log(currentUrl);
    const response = await axios.get(`${currentUrl}api/devices/filter`, {
      headers: { Authorization: `Bearer ${fetchedToken}` },
      params: { filter, hubSerialNumber },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching devices by filter:", error);
    throw error;
  }
};

export const getEventsByDeviceId = async (deviceId) => {
  try {
    const fetchedToken = getAuthToken();
    const currentUrl = getCurrentUrl();
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
    const response = await axios.get(
      `${currentUrl}api/events/device/${deviceId}`,
      {
        headers: { Authorization: `Bearer ${fetchedToken}` },
        params: { hubSerialNumber },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to fetch events for device:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const getStateValuesByDeviceId = async (deviceId, filter) => {
  try {
    const fetchedToken = getAuthToken();
    const currentUrl = getCurrentUrl();
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
    const response = await axios.get(
      `${currentUrl}api/states/device/${deviceId}`,
      {
        headers: { Authorization: `Bearer ${fetchedToken}` },
        params: { filter, hubSerialNumber },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching state values by device:", error);
    throw error;
  }
};

export const getCommandsByDeviceId = async (deviceId, filter) => {
  try {
    const fetchedToken = getAuthToken();
    const currentUrl = getCurrentUrl();
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
    const response = await axios.get(
      `${currentUrl}api/commands/device/${deviceId}`,
      {
        headers: { Authorization: `Bearer ${fetchedToken}` },
        params: { filter, hubSerialNumber },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching commands by device:", error);
    throw error;
  }
};