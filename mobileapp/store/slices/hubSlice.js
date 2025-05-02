import { createSlice } from "@reduxjs/toolkit";

const hubSlice = createSlice({
  name: "hub",
  initialState: {
    currentHubSerialNumber: null,
    currentHubName: "",
    currentHubDetails: {},
    userHubs: [], 
    adminInvitationCode: null,
  },
  reducers: {
    setCurrentHub(state, action) {
      state.currentHubSerialNumber = action.payload.serialNumber;
      state.currentHubName = action.payload.hubName;
      state.currentHubDetails = action.payload.hubDetails;
    },
    clearCurrentHub(state) {
      state.currentHubSerialNumber = null;
      state.currentHubName = "";
      state.currentHubDetails = {};
      state.adminInvitationCode = null;
    },
    addUserHub(state, action) {
      const exists = state.userHubs.some(
        (hub) => hub.serialNumber === action.payload.serialNumber 
      );
      if (!exists) {
        state.userHubs.push(action.payload);
      }
    },
    setAdminInvitationCode(state, action) {
      state.adminInvitationCode = action.payload;
    },
    clearUserHubs(state) {
      state.userHubs = [];
    },
  },
});

export const {
  setCurrentHub,
  clearCurrentHub,
  addUserHub,
  clearUserHubs,
  setAdminInvitationCode
} = hubSlice.actions;

export default hubSlice.reducer;
