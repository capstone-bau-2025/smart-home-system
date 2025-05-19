import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { LOCAL_URL } from "../../util/auth";
import { store } from "../../store/store";


export const getAllAutomations = async () => {
  const token = store.getState().user.localToken;
  const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;

  const response = await axios.get(`${LOCAL_URL}api/automations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      hubSerialNumber,
    },
  });

  return response.data;
};

export const createAutomationRule = async (automationData) => {
  try {
    const token = store.getState().user.localToken;
    const hubSerialNumber = store.getState().hub.currentHub?.serialNumber;

    const response = await axios.post(`${LOCAL_URL}api/automations`, automationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        hubSerialNumber,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to create automation:", error?.response?.data || error.message);
    throw error;
  }
};

export const updateAutomationStatus = async (ruleId, isEnabled) => {
  try {
    const token = store.getState().user.localToken;

    const response = await axios.patch(`${LOCAL_URL}api/automations/status`, {
      ruleId,
      isEnabled,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to update automation status:", error?.response?.data || error.message);
    throw error;
  }
};


export const deleteAutomation = async (ruleId) => {
  try {
    const token = store.getState().user.localToken;

    const response = await axios.delete(`${LOCAL_URL}api/automations/${ruleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed to delete automation:", error?.response?.data || error.message);
    throw error;
  }
};


