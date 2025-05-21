import { store } from "../store/store";
import { ACTIVE_URL } from "./auth";
import { BASE_URL } from "./auth";

export default function getCurrentUrl() {
  return store.getState().url.currentUrl || ACTIVE_URL;
}

