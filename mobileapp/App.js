import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/Tabs/HomeScreen";
import AutomationScreen from "./screens/Tabs/AutomationScreen";
import SurveillanceScreen from "./screens/Tabs/SurveillanceScreen";
import ProfileScreen from "./screens/Tabs/ProfileScreen";
import DiscoverDevice from "./screens/Homescreen/DiscoverDevice";
import ManageDevice from "./screens/Homescreen/ManageDevice";
import ManageHub from "./screens/Homescreen/ManageHub";
import DiscoverHub from "./screens/Homescreen/DiscoverHub";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import CustomToast from "./components/UI/CustomToast";
import ConfigureAutomation from "./screens/AutomationScreen/ConfigureAutomation";
import Trigger from "./screens/AutomationScreen/Trigger";
import StatusChange from "./screens/AutomationScreen/StatusChange";
import Schedule from "./screens/AutomationScreen/Schedule";
import Action from "./screens/AutomationScreen/Action";

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
  const [currentHub, setCurrentHub] = useState("Hub1");

  const [fontsLoaded] = useFonts({
    "Lexend-Bold": require("./assets/fonts/Lexend-Bold.ttf"),
    "Lexend-Regular": require("./assets/fonts/Lexend-Regular.ttf"),
    "Urbanist-Thin": require("./assets/fonts/Urbanist-Thin.ttf"),
    "Urbanist-Regular": require("./assets/fonts/Urbanist-Regular.ttf"),
  });

  if (isLoading || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? (
        <AuthenticatedStack currentHub={currentHub} setCurrentHub={setCurrentHub} />
      ) : (
        <AuthStack />
      )}

      <CustomToast />
    </NavigationContainer>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <LoginScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Register"
        options={{ headerShown: true, headerTitle: "", headerTransparent: true }}
      >
        {(props) => <RegisterScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthenticatedStack({ currentHub, setCurrentHub }) {
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
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      >
        {(props) => <HomeStackNavigator {...props} currentHub={currentHub} setCurrentHub={setCurrentHub} />}
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="Surveillance"
        component={SurveillanceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} />,
        }}
      />

      <BottomTabs.Screen
        name="Automation"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="alarm-outline" size={size} color={color} />,
        }}
      >
        {(props) => <AutomationStackNavigator  {...props} currentHub={currentHub} />}
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
    </BottomTabs.Navigator>
  );
}

function HomeStackNavigator({ currentHub, setCurrentHub }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Hub" options={{ headerShown: false }}>
        {(props) => <HomeScreen {...props} currentHub={currentHub} setCurrentHub={setCurrentHub} />}
      </Stack.Screen>
      <Stack.Screen name="DiscoverDevice" component={DiscoverDevice} options={{ headerShown: true, headerTitle: "Discover Device" }} />
      <Stack.Screen name="DiscoverHub" component={DiscoverHub} options={{ headerShown: true, headerTitle: "Discover Hub" }} />
      <Stack.Screen name="ManageHub" component={ManageHub} options={{ headerTransparent: true, headerTitle: "" }} />
      <Stack.Screen name="ManageDevice" component={ManageDevice} options={{ headerTransparent: true, headerTitle: "" }} />
    </Stack.Navigator>
  );
}
function AutomationStackNavigator({ currentHub, setCurrentHub }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Automations" options={{ headerShown: false }}>
        {(props) => <AutomationScreen {...props} currentHub={currentHub} setCurrentHub={setCurrentHub} />}
      </Stack.Screen>
      <Stack.Screen name="ConfigureAutomation" options={{  headerTransparent:true, headerTitle:"" }}>
        {(props) => <ConfigureAutomation {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Schedule" options={{  headerTransparent:true, headerTitle:"" }}>
        {(props) => <Schedule {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Trigger" options={{  headerTransparent:true, headerTitle:"" }}>
        {(props) => <Trigger {...props} />}
      </Stack.Screen>
      <Stack.Screen name="StatusChange" options={{  headerTransparent:true, headerTitle:"" }}>
        {(props) => <StatusChange {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Action" options={{  headerTransparent:true, headerTitle:"" }}>
        {(props) => <Action {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
