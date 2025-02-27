import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ActivityIndicator,
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
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import AuthContextProvider, { AuthContext } from "./store/auth-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <AuthContextProvider> 
      <RootApp />
    </AuthContextProvider>
  );
}

function RootApp() {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return ( //screens nav logic
    <NavigationContainer>
      {userToken !== null ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function AuthStack() { //login + register screens
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <LoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Register" options={{ headerShown: true, headerTitle: "", headerTransparent: true }}>
        {(props) => <RegisterScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthenticatedStack() { //actual app
  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "white" },
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
        {(props) => <ProfileScreen {...props} />}
      </BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
