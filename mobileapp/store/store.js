import { configureStore } from "@reduxjs/toolkit";
import hubReducer from "./slices/hubSlice";
import userReducer from "./slices/userSlice"
import areaReducer from "./slices/areaSlice";
import urlReducer from "./slices/urlSlice";

export const store = configureStore({
  reducer: {
    hub: hubReducer,
    user: userReducer,
    area: areaReducer,
    url: urlReducer,
  },
});
