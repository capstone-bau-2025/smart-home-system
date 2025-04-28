import { configureStore } from "@reduxjs/toolkit";
import hubReducer from "./slices/hubSlice";

export const store = configureStore({
  reducer: {
    hub: hubReducer,
  },
});
