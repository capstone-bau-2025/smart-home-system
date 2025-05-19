import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { LOCAL_URL } from "../../util/auth";
import { store } from "../../store/store";

export const getDeviceByArea = async (areaId, hubSerialNumber) => {
  const localToken = store.getState().user.localToken;
  const response = await axios.get(
    `${LOCAL_URL}api/devices/by-area/${areaId}`,
    {
      headers: {
        Authorization: `Bearer ${localToken}`,
        parameter: hubSerialNumber,
      },
    }
  );
  return response.data;
};

export const updateDeviceName = async (deviceId, newName) => {
  const token = store.getState().user.localToken;
  const response = await axios.put(
    `${LOCAL_URL}api/devices/${deviceId}/name`,
    {},
    {
      params: { name: newName },
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  const response = await axios.put(
    `${LOCAL_URL}api/devices/${deviceId}/area`,
    {}, // no body
    {
      params: { areaId },
      headers: {
        Authorization: `Bearer ${token}`,
        parameter: hubSerialNumber,
      },
    }
  );

  return response.data;
};

export const pingDevice = async (deviceId, token, hubSerialNumber) => {
  const response = await axios.get(`${LOCAL_URL}api/devices/${deviceId}/ping`, {
    headers: {
      Authorization: `Bearer ${token}`,
      parameter: hubSerialNumber,
    },
  });

  return response.data;
};

export const deleteDevice = async (deviceId, token, hubSerialNumber) => {
  const response = await axios.delete(`${LOCAL_URL}api/devices/${deviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      parameter: hubSerialNumber,
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
      list.map((device) => ({
        ...device,
        areaId,
      }))
    );

    dispatch(setDevices(allDevices));
  } catch (err) {
    console.error("❌ Error fetching devices per area:", err);
  }
};

export const fetchDeviceByFilter = async (filter) => {
  try {
    const token = store.getState().user.localToken;
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;

    const response = await axios.get(
      `${LOCAL_URL}api/devices/filter`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { filter,hubSerialNumber },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching devices by filter:", error);
    throw error;
  }
};


export const getEventsByDeviceId = async (deviceId) => {
  try {
    const token = store.getState().user.localToken;

    const response = await axios.get(`${LOCAL_URL}api/events/device/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch events for device:", error?.response?.data || error.message);
    throw error;
  }
};


export const getStateValuesByDeviceId = async (deviceId, filter ) => {
  try {
    const token = store.getState().user.localToken;

    const response = await axios.get(
      `${LOCAL_URL}api/states/device/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { filter },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching state values by device:", error);
    throw error;
  }
};


export const getCommandsByDeviceId = async (deviceId, filter ) => {
  try {
    const token = store.getState().user.localToken;

    const response = await axios.get(
      `${LOCAL_URL}api/commands/device/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { filter },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching state values by device:", error);
    throw error;
  }
};