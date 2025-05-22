import { store } from "../store/store";
import getCurrentUrl from "./helperUrl";

export default function getAuthToken() {
  const currentUrl = getCurrentUrl();
  const localToken = store.getState().user.localToken;
  const cloudToken = store.getState().user.cloudToken;


  return currentUrl.includes("8080") ? localToken : cloudToken;
  // return currentUrl === "http://raspberrypi.local:8080/"  //   ? localToken //   : cloudToken;
}
