import { createSlice } from "@reduxjs/toolkit";

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [],
    interactions: [], 
  },
  reducers: {
    setDevices(state, action) {
      state.devices = action.payload;
    },
    clearDevices(state) {
      state.devices = [];
    },
    setInteractions(state, action) {
      state.interactions = action.payload;
    },
    clearInteractions(state) {
      state.interactions = [];
    },
  },
});

export const {
  setDevices,
  clearDevices,
  setInteractions,
  clearInteractions,
} = devicesSlice.actions;

export default devicesSlice.reducer;