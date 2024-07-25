import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Dimensions, Image, ImageBackground, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"; // Import from the core stack library
import { getApps, initializeApp } from "firebase/app";
import {
  initializeAuth,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebaseConfig from "./firebaseConfig";
import {
  useUserData,
  UserDataProvider,
} from "./src/screens/shared/contexts/UserDataContext";
import { DateTimeProvider } from "./src/screens/shared/contexts/DateTimeContext";

import Login from "./src/screens/Auth Screens/Login";
import Register from "./src/screens/Auth Screens/Register";
import ResetPassword from "./src/screens/Auth Screens/ResetPassword";
import Authenticating from "./src/screens/Auth Screens/Authenticating";
import Home from "./src/screens/Home/Home";
import Insights from "./src/screens/Insights Screens/Insights";
import Trips from "./src/screens/Trips Screens/Trips";
import Map from "./src/screens/Map Screens/Map";
import Profile from "./src/screens/Profile Screens/Profile";

const Stack = createStackNavigator();
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Authenticating: undefined;
  Settings: undefined;
  Trips: { openForm: boolean };
  Map: undefined;
  Profile: undefined;
};

const MainApp = () => {
  const [initializing, setInitializing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const { setUid, userData, uid } = useUserData(); // Get setUid from context

  // Initialise Firebase
  useEffect(() => {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      const auth = initializeAuth(app, {
        persistence: reactNativePersistence(AsyncStorage),
      });
      setAuth(auth);
    }
  }, []);

  // Initialise fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Arimo-Italic": require("./assets/fonts/Arimo-Italic.ttf"),
        "Arimo-Bold": require("./assets/fonts/Arimo-Bold.ttf"),
        "Arimo-Regular": require("./assets/fonts/Arimo-Regular.ttf"),
      });
    }

    loadFonts();
  }, []);

  useEffect(() => {
    let unsubscribeAuth = () => {}; // Default empty function

    if (auth) {
      // Set Persistence
      setPersistence(auth, reactNativePersistence(AsyncStorage)).catch(
        (error) => {
          console.error("Error setting persistence:", error);
        }
      );

      // Listen for Auth State Changes
      unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const firebaseUid = user.uid;
          console.log("firebase uid: ", firebaseUid);
          setUid(firebaseUid); // Set UID in context
        }
        setInitializing(false); // Set initializing to false
      });
    }

    return unsubscribeAuth; // Cleanup on unmount
  }, [auth]);


  // Conditional Rendering
  if (initializing) {
    return (
      <ImageBackground
        source={require("./assets/images/login_background.png")}
        style={styles.page_background}
      >
        <Image
          style={styles.logo}
          source={require("./assets/images/logo.png")}
        />
      </ImageBackground>
    );
  }

  const config = {
    animation: "timing",
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={user ? "Home" : "Login"}
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Authenticating" component={Authenticating} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Insights" component={Insights} />
            <Stack.Screen
              name="Trips"
              component={Trips}
              initialParams={{ openForm: false }}
            />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserDataProvider>
      <DateTimeProvider>
        <MainApp />
      </DateTimeProvider>
    </UserDataProvider>
  );
}

const styles = StyleSheet.create({
  page_background: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EBEBEB",
    alignItems: "flex-start",
    padding: 20,
  },
  logo: {
    resizeMode: "contain",
    width: "50%",
    height: "20%",
    marginBottom: "5%",
  },
  title: {
    fontSize: 36,
    fontFamily: "Arimo-Bold",
  },
});
