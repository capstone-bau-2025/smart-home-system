import axios from "axios";
import { LOCAL_URL } from "../../util/auth";
import { store } from "../../store/store";
import getCurrentUrl from "../../util/helperUrl";
import getAuthToken from "../../util/getAuthToken";

export const fetchAllInteractions = async () => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  try {
    const res = await axios.get(`${currentUrl}api/interactions`, {
      headers: {
        Authorization: `Bearer ${fetchedToken}`,
        Accept: "application/json",
      },
      params: {
        hubSerialNumber,
      },
    });

    return res.data;
  } catch (err) {
    console.error(
      "Error fetching interactions:",
      err?.response?.data || err.message
    );
    throw err;
  }
};

export const updateInteractionState = async (stateValueId, value) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const res = await axios.post(
    `${currentUrl}api/interactions/update-state`,
    {
      stateValueId,
      value,
    },
    {
      headers: {
        Authorization: `Bearer ${fetchedToken}`,
      },
      params: {
        hubSerialNumber,
      },
    }
  );

  return res.data;
};

export const executeInteractionCommand = async (deviceId, commandId) => {
  const fetchedToken = getAuthToken();
  const currentUrl = getCurrentUrl();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const res = await axios.post(
    `${currentUrl}api/interactions/execute-command`,
    {
      deviceId,
      commandId,
    },
    {
      headers: {
        Authorization: `Bearer ${fetchedToken}`,
      },
      params: {
        hubSerialNumber,
      },
    }
  );

  return res.data;
};

export async function fetchStateValue(stateValueId) {
  const fetchedToken = getAuthToken();
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;
  const currentUrl = getCurrentUrl();
  try {
    const res = await axios.get(
      `${currentUrl}api/interactions/fetch-state/${stateValueId}`,
      {
        headers: {
          Authorization: `Bearer ${fetchedToken}`,
          Accept: "*/*",
        },
        params: {
          hubSerialNumber,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch state:", err);
    throw err;
  }
}
