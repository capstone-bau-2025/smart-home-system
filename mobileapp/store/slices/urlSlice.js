import { createSlice } from "@reduxjs/toolkit";

const urlSlice = createSlice({
  name: "url",
  initialState: {
    currentUrl: null, 
  },
  reducers: {
    setUrl(state, action) {
      state.currentUrl = action.payload;
    }, 
  },
});

export const { setUrl } = urlSlice.actions;
export default urlSlice.reducer;



