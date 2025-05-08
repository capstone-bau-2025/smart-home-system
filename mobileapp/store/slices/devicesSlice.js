import { createSlice } from "@reduxjs/toolkit";

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    devices: [], 
  },
  reducers: {
    setDevices(state, action) {
      state.devices = action.payload;
    }, 
    clearDevices(state) {
      state.devices = [];
    },
  },
});

export const { setDevices, clearDevices } = devicesSlice.actions;
export default devicesSlice.reducer;
