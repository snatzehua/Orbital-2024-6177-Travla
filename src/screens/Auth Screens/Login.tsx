import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButtom";

const Login = () => {
  // Typing for navigation
  type RootStackParamList = {
    Register: undefined;
    ResetPassword: undefined;
    Authenticating: undefined;
    Home: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // For enabling scrollview if screen is too small
  const { height } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const onContentSizeChange = (contentHeight: number) => {
    setContentHeight(contentHeight);
  };

  // Defining hooks for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Defining button press functions
  const handleLogin = async () => {
    // Check fields are filled
    if (email == "" || password == "") {
      setError("Please fill in all fields");
      return;
    }

    try {
      const auth = getAuth();
      navigation.navigate("Authenticating");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setError("");
      // Check for cases (so what is user?)
      const user = userCredential.user;
      navigation.navigate("Home");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const pressForgotPasswordButton = () => {
    navigation.navigate("ResetPassword");
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);

      // Check if credential exists before using it
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const token = credential.accessToken;
        const user = result.user;
        // Use the token and user information
        // ...
      } else {
        // Handle the case where authentication failed
        console.error("Google sign-in failed. No credential received.");
      }
    } catch (error: any) {
      // Handle other errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    }
  };

  const pressFacebookLoginButton = () => {
    console.warn("Google Login pressed");
  };

  const pressRegisterButton = () => {
    navigation.navigate("Register");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/login_background.png")}
      style={styles.page_background}
    >
      <ScrollView
        scrollEnabled={contentHeight > height}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/logo.png")}
          />
          <View
            style={{
              flexGrow: 1,
              width: Dimensions.get("window").width,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={
                error == ""
                  ? styles.error_container_empty
                  : styles.error_container_full
              }
            >
              <Text style={styles.error_text}>{error}</Text>
            </View>
            <CustomInput
              value={email}
              setValue={setEmail}
              placeholder="Email"
              secureTextEntry={false}
            />
            <CustomInput
              value={password}
              setValue={setPassword}
              placeholder="Password"
              secureTextEntry={true}
              onSubmitEditing={handleLogin}
            />
            <CustomButton
              text="Login"
              onPress={handleLogin}
              containerStyle={styles.login_container}
              textStyle={styles.login_text}
            />
            <CustomButton
              text="Forgot password?"
              onPress={pressForgotPasswordButton}
              textStyle={styles.link_text}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: "5%",
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
              <View>
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontFamily: "Arimo-Regular",
                    marginHorizontal: "2.5%",
                  }}
                >
                  Or
                </Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            </View>
            <View style={{ margin: 20 }}>
              <FontAwesome.Button
                name="google"
                color="white"
                backgroundColor="#558AED"
                onPress={handleGoogleLogin}
              >
                Login with Google
              </FontAwesome.Button>
              <View style={{ margin: 5 }}></View>
              <FontAwesome.Button
                name="facebook"
                color="white"
                backgroundColor="#425E9A"
                onPress={pressFacebookLoginButton}
              >
                Login with Facebook
              </FontAwesome.Button>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.redirect_text}>Don't have an account? </Text>
            <CustomButton
              text="Register"
              onPress={pressRegisterButton}
              wrapperStyle={{}}
              containerStyle={styles.redirect_container}
              textStyle={styles.link_text}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  page_background: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  logo: {
    resizeMode: "contain",
    width: "50%",
    height: "20%",
    marginTop: "5%",
  },
  error_container_empty: {
    minHeight: 20,
    paddingVertical: 3,
    marginBottom: 10,
  },
  error_container_full: {
    backgroundColor: "#FFF3F3",
    borderWidth: 1,
    borderColor: "#FF1705",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  error_text: {
    color: "#FF1705",
    minHeight: 18,
  },
  login_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  login_text: {
    fontFamily: "Arimo-Bold",
  },
  redirect_container: {},
  redirect_text: {
    fontFamily: "Arimo-Regular",
  },
  link_text: {
    color: "blue",
    fontFamily: "Arimo-Regular",
    textDecorationLine: "underline",
  },
});

export default Login;
