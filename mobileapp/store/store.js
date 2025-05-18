import { configureStore } from "@reduxjs/toolkit";
import hubReducer from "./slices/hubSlice";
import userReducer from "./slices/userSlice"
import areaReducer from "./slices/areaSlice";
import urlReducer from "./slices/urlSlice";
import devicesReducer from "./slices/devicesSlice";

export const store = configureStore({
  reducer: {
    hub: hubReducer,
    user: userReducer,
    areas: areaReducer,
    url: urlReducer,
    devices: devicesReducer,
  },
});
