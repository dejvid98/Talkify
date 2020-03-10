import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Login from "./src/Login/Login";
import Register from "./src/Register/Register";
import Landing from "./src/LandingScreen/Landing";
import { decode, encode } from "base-64";
import { YellowBox } from "react-native";
import Messages from "./src/HomePage/Messages";
import Friends from "./src/HomePage/Friends";
import Profile from "./src/HomePage/Profile";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { ContextProvider } from "./Context";

YellowBox.ignoreWarnings(["Setting a timer"]);

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
const BottomNavigation = createMaterialBottomTabNavigator();

const BottomNav = () => {
  return (
    <BottomNavigation.Navigator
      activeColor="#30e3ca"
      barStyle={{ backgroundColor: "#20232A" }}
      inactiveColor="#fff"
    >
      <BottomNavigation.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="message" color={color} size={26} />
          )
        }}
      />
      <BottomNavigation.Screen
        name="Friends"
        component={Friends}
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              color={color}
              size={26}
            />
          )
        }}
      />
      <BottomNavigation.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="settings" color={color} size={26} />
          )
        }}
      />
    </BottomNavigation.Navigator>
  );
};
const Stack = createStackNavigator();

export default function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          headerMode="screen"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Landing" component={Landing} headerShow="false" />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" children={BottomNav} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}
