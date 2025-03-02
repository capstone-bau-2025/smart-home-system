import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Pressable,
} from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AutomationScreen from "./screens/AutomationScreen";
import SurveillanceScreen from "./screens/SurveillanceScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  function screensHandler() {
    setAuthenticated((prevState) => !prevState);
  }

  const [fontsLoaded] = useFonts({
    "Lexend-Bold": require("./assets/fonts/Lexend-Bold.ttf"),
    "Lexend-Regular": require("./assets/fonts/Lexend-Regular.ttf"),
    "Urbanist-Thin": require("./assets/fonts/Urbanist-Thin.ttf"),
    "Urbanist-Regular": require("./assets/fonts/Urbanist-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  function AuthStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => (
            <LoginScreen {...props} screensHandler={screensHandler} />
          )}
          {/* to pass extra props */}
        </Stack.Screen>
        <Stack.Screen name="Register" options={{ headerShown: true, headerTitle: "", headerTransparent: true }}>
          {(props) => <RegisterScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  function AuthenticatedStack() {
    return (
      <BottomTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: "orange", // Active tab color
          tabBarInactiveTintColor: "gray", // Inactive tab color
          tabBarStyle: { backgroundColor: "white" }, // Background color of the tab bar
        }}
      >
        <BottomTabs.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        >
          {(props) => <HomeScreen {...props} />}
        </BottomTabs.Screen>
  
        <BottomTabs.Screen
          name="Surveillance"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera-outline" size={size} color={color} />
            ),
          }}
        >
          {(props) => <SurveillanceScreen {...props} />}
        </BottomTabs.Screen>
  
        <BottomTabs.Screen
          name="Automation"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="alarm-outline" size={size} color={color} />
            ),
          }}
        >
          {(props) => <AutomationScreen {...props} />}
        </BottomTabs.Screen>
  
        <BottomTabs.Screen
          name="Profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        >
          {(props) => <ProfileScreen {...props} screensHandler={screensHandler} />}
        </BottomTabs.Screen>
      </BottomTabs.Navigator>
    );
  }
  
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        {authenticated ? <AuthenticatedStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
