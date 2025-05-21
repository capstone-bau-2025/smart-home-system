import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function getFcmToken() {
  if (!Constants.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId, // OR your project ID manually
  });

  return tokenData?.data || null;
}


//If you're using Firebase FCM directly and not Expo Push Tokens, replace with:

//import messaging from '@react-native-firebase/messaging';

// export async function getFcmToken() {
//   await messaging().requestPermission();
//   const token = await messaging().getToken();
//   return token;
// }



// Send this token to your backend on signup
//import { getFcmToken } from "./notificationService";

// async function registerUser(email, password, username) {
//   const fcmToken = await getFcmToken();

//   const payload = {
//     email,
//     password,
//     username,
//     fcmToken, // This goes to your backend
//   };

//   await axios.post(`${BASE_URL}/register`, payload);
// }



// import * as Notifications from "expo-notifications";

// // Show alerts while app is foregrounded
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });