import { createSlice } from "@reduxjs/toolkit";

const hubSlice = createSlice({
  name: "hub",
  initialState: {
    currentHub: null, // will store { name, role, serialNumber }
    userHubs: [],     // array of hubs: [{ name, role, serialNumber },{name, role, serialNumber}]
    adminInvitationCode: null,
  },
  reducers: {
    setCurrentHub(state, action) {
      state.currentHub = action.payload; // full hub object
    },
    clearCurrentHub(state) {
      state.currentHub = null;
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
    setUserHubs(state, action) {
      state.userHubs = action.payload;
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
  setAdminInvitationCode,
  setUserHubs,
} = hubSlice.actions;

export default hubSlice.reducer;
