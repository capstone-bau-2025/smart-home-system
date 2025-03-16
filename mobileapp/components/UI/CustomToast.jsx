import React from "react";
import Toast, { BaseToast } from "react-native-toast-message";

const toastConfig = {
  success: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4CAF50",
        backgroundColor: "white",
        position: "absolute",
        top: 50, 
        right: 10, 
        width: 300, 
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
      }}
      text2Style={{
        fontSize: 14,
        color: "#black",
      }}
    />
  ),
  error: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#FF3B30",
        backgroundColor: "#E74C3C",
        position: "absolute",
        top: 50,
        right: 10,
        width: 300,
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
      }}
      text2Style={{
        fontSize: 14,
        color: "black",
      }}
    />
  ),
};

export default function CustomToast() {
  return <Toast config={toastConfig} />;
}
