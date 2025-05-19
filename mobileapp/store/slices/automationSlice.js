import { createSlice } from "@reduxjs/toolkit";

const automationSlice = createSlice({
  name: "automation",
  initialState: {
    name: null,
    description: null,
    type: null,
    selectedTime: null,
    ifDevice: null,
    ifDeviceStatus: null,
    thenDevice: null,
    thenDeviceStatus: null,
    cooldown: null,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    setIfDevice: (state, action) => {
      state.ifDevice = action.payload;
    },
    setIfDeviceStatus: (state, action) => {
      state.ifDeviceStatus = action.payload;
    },
    setThenDevice: (state, action) => {
      state.thenDevice = action.payload;
    },
    setThenDeviceStatus: (state, action) => {
      state.thenDeviceStatus = action.payload;
    },
    setCooldown: (state, action) => {
      state.cooldown = action.payload;
    },
    clearScheduleFields: (state) => {
      state.selectedTime = null;
    },
    clearEventFields: (state) => {
      state.ifDevice = null;
      state.ifDeviceStatus = null;
    },
    clearStatusChangeFields: (state) => {
      state.ifDevice = null;
      state.ifDeviceStatus = null;
    },
    clearThenDeviceFields: (state) => {
      state.thenDevice = null;
      state.thenDeviceStatus = null;
    },
    resetAutomation: (state) => {
      state.name = null;
      state.description = null;
      state.type = null;
      state.selectedTime = null;
      state.ifDevice = null;
      state.ifDeviceStatus = null;
      state.thenDevice = null;
      state.thenDeviceStatus = null;
      state.cooldown = null;
    },
  },
});

export const {
  setName,
  setDescription,
  setType,
  setSelectedTime,
  setIfDevice,
  setIfDeviceStatus,
  setThenDevice,
  setThenDeviceStatus,
  setCooldown,
  resetAutomation,
  clearScheduleFields,
  clearEventFields,
  clearStatusChangeFields,
  clearThenDeviceFields,
} = automationSlice.actions;

export default automationSlice.reducer;
