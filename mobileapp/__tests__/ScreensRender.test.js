import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../store/auth-context";

// Redux slices
import hubReducer from "../store/slices/hubSlice";
import userReducer from "../store/slices/userSlice";
import areaReducer from "../store/slices/areaSlice";
import urlReducer from "../store/slices/urlSlice";
import devicesReducer from "../store/slices/devicesSlice";

// Mocks
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock("react-native-webview", () => {
  const React = require("react");
  return { WebView: (props) => React.createElement("WebView", props) };
});
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return { Ionicons: (props) => React.createElement("Ionicons", props) };
});

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/Tabs/HomeScreen";
import ProfileScreen from "../screens/Tabs/ProfileScreen";
import SurveillanceScreen from "../screens/Tabs/SurveillanceScreen";
import AutomationScreen from "../screens/Tabs/AutomationScreen";
import Action from "../screens/Tabs/AutomationScreen/Action";
import ConfigureAutomation from "../screens/Tabs/AutomationScreen/ConfigureAutomation";
import NewAutomation from "../screens/Tabs/AutomationScreen/NewAutomation";
import Schedule from "../screens/Tabs/AutomationScreen/Schedule";
import StatusChange from "../screens/Tabs/AutomationScreen/StatusChange";
import Trigger from "../screens/Tabs/AutomationScreen/Trigger";
import DiscoverDevice from "../screens/Tabs/Homescreen/DiscoverDevice";
import DiscoverHub from "../screens/Tabs/Homescreen/DiscoverHub";
import ManageDevice from "../screens/Tabs/Homescreen/ManageDevice";
import ManageHub from "../screens/Tabs/Homescreen/ManageHub";

// Suppress irrelevant act() warnings
jest.spyOn(console, "error").mockImplementation((msg) => {
  if (msg.includes("not wrapped in act")) return;
  console.warn(msg);
});

const mockNav = { navigate: jest.fn() };
const mockCtx = { login: jest.fn(), authStatus: 200 };

const store = configureStore({
  reducer: {
    hub: hubReducer,
    user: userReducer,
    area: areaReducer,
    url: urlReducer,
    devices: devicesReducer,
  },
  preloadedState: {
    hub: {
      userHubs: [{ name: "Home", serialNumber: "123456789", role: "admin" }],
      currentHub: { name: "Home", serialNumber: "123456789", role: "admin" },
    },
    user: {
      username: "testuser",
      email: "test@example.com",
      userRole: "owner",
    },
    area: { areas: [] },
    url: { currentUrl: "http://localhost:8080" },
    devices: { devices: [] },
  },
});

const renderWrapped = (component) =>
  render(
    <NavigationContainer>
      <Provider store={store}>
        <AuthContext.Provider value={mockCtx}>
          {component}
        </AuthContext.Provider>
      </Provider>
    </NavigationContainer>
  );

describe("All screens render without crashing", () => {
  const screens = [
    { name: "LoginScreen", component: <LoginScreen navigation={mockNav} /> },
    { name: "RegisterScreen", component: <RegisterScreen navigation={mockNav} /> },
    { name: "HomeScreen", component: <HomeScreen navigation={mockNav} /> },
    { name: "ProfileScreen", component: <ProfileScreen navigation={mockNav} /> },
    { name: "SurveillanceScreen", component: <SurveillanceScreen navigation={mockNav} /> },
    {
      name: "AutomationScreen",
      component: (
        <AutomationScreen navigation={mockNav} selectedTab={{ name: "home" }} />
      ),
    },
    { name: "Action", component: <Action navigation={mockNav} /> },
    {
      name: "ConfigureAutomation",
      component: (
        <ConfigureAutomation
          navigation={mockNav}
          route={{ params: { currentAutomation: {} } }}
        />
      ),
    },
    {
      name: "NewAutomation",
      component: (
        <NewAutomation
          navigation={mockNav}
          route={{ params: { currentAutomation: {} } }}
        />
      ),
    },
    { name: "Schedule", component: <Schedule navigation={mockNav} /> },
    { name: "StatusChange", component: <StatusChange navigation={mockNav} /> },
    { name: "Trigger", component: <Trigger navigation={mockNav} /> },
    { name: "DiscoverDevice", component: <DiscoverDevice navigation={mockNav} /> },
    { name: "DiscoverHub", component: <DiscoverHub navigation={mockNav} /> },
    {
      name: "ManageDevice",
      component: (
        <ManageDevice navigation={mockNav} selectedTab={{ name: "home" }} />
      ),
    },
    { name: "ManageHub", component: <ManageHub navigation={mockNav} /> },
  ];

  screens.forEach(({ name, component }) => {
    it(`renders ${name}`, () => {
      renderWrapped(component);
    });
  });
});
