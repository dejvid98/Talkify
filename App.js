import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Login from "./src/Login/Login";
import Register from "./src/Register/Register";
import Landing from "./src/LandingScreen/Landing";
import Messages from "./src/HomePage/Messages/Messages";
import Friends from "./src/HomePage/Friends/Friends";
import Profile from "./src/HomePage/Profile/Profile";
import AddFriend from "./src/HomePage/Friends/AddFriend";
import SingleChatWindow from "./src/HomePage/Messages/ChatWindow";
import { decode, encode } from "base-64";
import { YellowBox } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { ContextProvider } from "./Context";
import ignoreWarnings from "react-native-ignore-warnings";
import firebase from "./firebase";
import * as Font from "expo-font";

// Ignores firebase interaction warnings (this is a known bug)
YellowBox.ignoreWarnings(["Setting a timer"]);
ignoreWarnings("Setting a timer");

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
const getFonts = () =>
  Font.loadAsync({
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf")
  });

const BottomNavigation = createMaterialBottomTabNavigator();

const BottomNav = () => {
  return (
    <BottomNavigation.Navigator
      activeColor="#00ff71"
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(
    () => {
      getFonts();
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          setIsLoggedIn(true);
        } else {
          return;
        }
      });
    },
    //eslint-disable-next-line
    []
  );
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
          <Stack.Screen name="Home" children={BottomNav} />
          <Stack.Screen
            name="LandingLogout"
            component={Landing}
            headerShow="false"
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SingleChatWindow" component={SingleChatWindow} />
          <Stack.Screen name="AddFriend" component={AddFriend} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}
