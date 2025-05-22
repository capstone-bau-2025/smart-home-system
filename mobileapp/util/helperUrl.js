import { store } from "../store/store";
import { LOCAL_URL } from "./auth";

export default function getCurrentUrl() {
  const currentUrl = store.getState().url.currentUrl;
  return currentUrl ?? LOCAL_URL;
}
