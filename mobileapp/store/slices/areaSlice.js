import { createSlice } from "@reduxjs/toolkit";

const areaSlice = createSlice({
  name: "areas",
  initialState: {
    areas: [], 
  },
  reducers: {
    setAreas(state, action) {
      state.areas = action.payload;
    }, 
    clearAreas(state) {
      state.areas = [];
    },
  },
});

export const { setAreas, clearAreas } = areaSlice.actions;
export default areaSlice.reducer;
