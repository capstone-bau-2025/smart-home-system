import { configureStore } from "@reduxjs/toolkit";
import hubReducer from "./slices/hubSlice";
import userReducer from "./slices/userSlice"

export const store = configureStore({
  reducer: {
    hub: hubReducer,
    user: userReducer,
  },
});
