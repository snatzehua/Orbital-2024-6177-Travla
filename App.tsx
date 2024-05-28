import React, { useEffect } from "react";
import Animated from "react-native-reanimated";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import ResetPassword from "./src/screens/ResetPassword";
import Authenticating from "./src/screens/Authenticating";
import Home from "./src/screens/Home";

const Stack = createNativeStackNavigator();

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export default function App() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Arimo-Bold": require("./assets/fonts/Arimo-Bold.ttf"),
        "Arimo-Regular": require("./assets/fonts/Arimo-Regular.ttf"),
      });
    }

    loadFonts();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Authenticating" component={Authenticating} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EBEBEB",
    alignItems: "flex-start",
    padding: 20,
  },
  logo: {
    flex: 1,
    resizeMode: "contain",
    width: 200,
  },
  title: {
    fontSize: 36,
    fontFamily: "Arimo-Bold",
  },
});
