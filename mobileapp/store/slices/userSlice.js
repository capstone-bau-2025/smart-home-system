import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {     
    userRole: null,        
    cloudToken: "",     
    localToken: null,   
    email: null,
  },
  reducers: {
    setUser(state, action) {
      state.userRole = action.payload.userRole ?? null;
      state.cloudToken = action.payload.cloudToken;
      state.localToken = action.payload.localToken ?? null;
      state.email = action.payload.email ?? null; 
    },
    updateLocalToken(state, action) {
      state.localToken = action.payload.localToken;
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    clearUser(state) {
      state.userRole = null;
      state.cloudToken = "";
      state.localToken = null;
      state.email = null;
    },
  },
});

export const { setUser, updateLocalToken, clearUser, setUserRole } = userSlice.actions;
export default userSlice.reducer;
