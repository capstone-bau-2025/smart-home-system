import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/Tabs/HomeScreen";
import AutomationScreen from "./screens/Tabs/AutomationScreen";
import SurveillanceScreen from "./screens/Tabs/SurveillanceScreen";
import ProfileScreen from "./screens/Tabs/ProfileScreen";
import DiscoverDevice from "./screens/Tabs/Homescreen/DiscoverDevice";
import ManageDevice from "./screens/Tabs/Homescreen/ManageDevice";
import ManageHub from "./screens/Tabs/Homescreen/ManageHub";
import DiscoverHub from "./screens/Tabs/Homescreen/DiscoverHub";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import ConfigureAutomation from "./screens/Tabs/AutomationScreen/ConfigureAutomation"
import Trigger from "./screens/Tabs/AutomationScreen/Trigger";
import StatusChange from "./screens/Tabs/AutomationScreen/StatusChange";
import Schedule from "./screens/Tabs/AutomationScreen/Schedule";
import Action from "./screens/Tabs/AutomationScreen/Action";
import HeaderIcons from "./components/UI/HeaderIcons";
import NewAutomation from "./screens/Tabs/AutomationScreen/NewAutomation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useSelector } from "react-redux";
import { startActiveUrlMonitor } from "./util/auth";
import useInitAppData from "./hooks/useInitAppData";
const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

export default function App() {



  return (
    <SafeAreaProvider>
<Provider store={store}>
        <AuthContextProvider>
          <RootApp />
        </AuthContextProvider>
</Provider>
      <Toast/>
    </SafeAreaProvider>
  );
}

function RootApp() {
  const { isLoading, userToken } = useContext(AuthContext);
  const [currentHub, setCurrentHub] = useState("Hub1");
  const [baseUrl, setBaseUrl] = useState(null);

  // useEffect(() => {
  //   startActiveUrlMonitor();
  // }, []);
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
        <AuthenticatedStack
          currentHub={currentHub}
          setCurrentHub={setCurrentHub}
        />
      ) : (
        <AuthStack />
      )}
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
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
        }}
      >
        {(props) => <RegisterScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthenticatedStack({setCurrentHub }) {
  const currentHub = useSelector((state) => state.hub)

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
        {(props) => (
          <HomeStackNavigator
            {...props}
            currentHub={currentHub}
            setCurrentHub={setCurrentHub}
          />
        )}
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="Surveillance"
        component={SurveillanceScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="Automation"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => (
          <AutomationStackNavigator
            {...props}
            currentHub={currentHub}
            setCurrentHub={setCurrentHub}
          />
        )}
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function HomeStackNavigator({ currentHub, setCurrentHub }) {
  const [addModal, setAddModal] = useState(false);
  const [cogModal, setCogModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Hub" options={{ headerShown: false }}>
        {(props) => (
          <HomeScreen
            {...props}
            currentHub={currentHub}
            setCurrentHub={setCurrentHub}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="DiscoverDevice"
        component={DiscoverDevice}
        options={{ headerTransparent: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="DiscoverHub"
        component={DiscoverHub}
        options={{ headerTransparent: true, headerTitle: "" }}
      />
      <Stack.Screen
        name="ManageHub"
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => (
            <View style={styles.headerIcons}>
              <HeaderIcons
                onInfoPress={() => setInfoModal(true)}
                onAddPress={() => setAddModal(true)}
                onCogPress={() => setCogModal(true)}
                custompadding={true}
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <ManageHub
            {...props}
            currentHub={currentHub}
            addModal={addModal}
            cogModal={cogModal}
            infoModal={infoModal}
            setAddModal={setAddModal}
            setCogModal={setCogModal}
            setInfoModal={setInfoModal}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ManageDevice"
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => (
            <View style={styles.headerIcons}>
              <HeaderIcons
                onInfoPress={() => setInfoModal(true)}
                onAddPress={() => setAddModal(true)}
                cogHidden={true}
                custompadding={true}
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <ManageDevice
            {...props}
            currentHub={currentHub}
            addModal={addModal}
            cogModal={cogModal}
            infoModal={infoModal}
            setAddModal={setAddModal}
            setCogModal={setCogModal}
            setInfoModal={setInfoModal}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
function AutomationStackNavigator({ currentHub, setCurrentHub }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Automations" options={{ headerShown: false }}>
        {(props) => (
          <AutomationScreen
            {...props}
            currentHub={currentHub}
            setCurrentHub={setCurrentHub}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ConfigureAutomation"
        options={{ headerTransparent: true, headerTitle: "" }}
      >
        {(props) => <ConfigureAutomation {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Schedule"
        options={{ headerTransparent: true, headerTitle: "" }}
      >
        {(props) => <Schedule {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Trigger"
        options={{ headerTransparent: true, headerTitle: "" }}
      >
        {(props) => <Trigger {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="StatusChange"
        options={{ headerTransparent: true, headerTitle: "" }}
      >
        {(props) => <StatusChange {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="Action"
        options={{ headerTransparent: true, headerTitle: "" }}
      >
        {(props) => <Action {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="NewAutomation"
        options={{ headerTransparent: true, headerTitle: "" }}
      >
        {(props) => <NewAutomation {...props} />}
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
  headerIcons: {

  },
});
