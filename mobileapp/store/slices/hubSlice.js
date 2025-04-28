import { createSlice } from "@reduxjs/toolkit";

const hubSlice = createSlice({
  name: "hub",
  initialState: {
    hubId: null,
    hubName: "",
    hubDetails: {}, 
  },
  reducers: {
    setCurrentHub(state, action) {
      state.hubId = action.payload.hubId;
      state.hubName = action.payload.hubName;
      state.hubDetails = action.payload.hubDetails;
    },
    clearCurrentHub(state) {
      state.hubId = null;
      state.hubName = "";
      state.hubDetails = {};
    },
  },
});

export const { setCurrentHub, clearCurrentHub } = hubSlice.actions;
export default hubSlice.reducer;
