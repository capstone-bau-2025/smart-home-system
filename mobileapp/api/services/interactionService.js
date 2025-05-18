import axios from 'axios';
import { LOCAL_URL } from '../../util/auth';
import { store } from '../../store/store';

export const fetchAllInteractions = async () => {
  const localToken = store.getState().user.localToken;

  try {
    const res = await axios.get(`${LOCAL_URL}api/interactions`, {
      headers: {
        Authorization: `Bearer ${localToken}`,
        Accept: 'application/json',
      },
    });

    return res.data; 
  } catch (err) {
    console.error('Error fetching interactions:', err?.response?.data || err.message);
    throw err;
  }
};


export const updateInteractionState = async (stateValueId, value) => {
  const token = store.getState().user.localToken;

  const res = await axios.post(
    `${LOCAL_URL}api/interactions/update-state`,
    {
      stateValueId,
      value,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


export const executeInteractionCommand = async (deviceId, commandId) => {
  const token = store.getState().user.localToken;

  const res = await axios.post(
    `${LOCAL_URL}api/interactions/execute-command`,
    {
      deviceId,
      commandId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export async function fetchStateValue(stateValueId,) {
  const token = store.getState().user.localToken;
  try {
    const res = await axios.get(`${LOCAL_URL}api/interactions/fetch-state/${stateValueId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch state:", err);
    throw err;
  }
}