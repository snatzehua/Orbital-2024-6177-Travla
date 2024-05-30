import React, { useState } from "react";
import {
  Dimensions,
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButtom";
import { FirebaseError } from "firebase/app";

const Register = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Authenticating: undefined;
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Defining button press functions
  const handleSignUp = async () => {
    // Check fields are filled
    if (email == "" || password == "" || confirmPassword == "") {
      setError("Please fill in all fields");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      navigation.navigate("Authenticating");
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setError("");
      // Check for cases
      navigation.navigate("Login");
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setError("Email is already registered");
        } else if (error.code === "auth/invalid-email") {
          setError("Invalid email used");
        } else if (error.code === "auth/weak-password") {
          setError("Password is too short (6 characters minimum)");
        } else {
          setError("Error: Firebase error occurred");
        }
      } else {
        setError(error.message);
      }
    }
  };

  const pressGoogleLoginButton = () => {
    console.warn("Google Login pressed");
  };

  const pressFacebookLoginButton = () => {
    console.warn("Google Login pressed");
  };

  const pressLoginButton = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/register_background.png")}
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
          <View
            style={{
              flexGrow: 1,
              width: Dimensions.get("window").width,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={styles.title_container}>
              <Text style={styles.title_text}>Create an Account</Text>
            </View>
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
              placeholder="Create password"
              secureTextEntry={true}
            />
            <CustomInput
              value={confirmPassword}
              setValue={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry={true}
              onSubmitEditing={handleSignUp}
            />
            <CustomButton
              text="Register"
              onPress={handleSignUp}
              containerStyle={styles.register_container}
              textStyle={styles.register_text}
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
                onPress={pressGoogleLoginButton}
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
            <Text>Already have an account? </Text>
            <CustomButton
              text="Login"
              onPress={pressLoginButton}
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
  title_container: {
    margin: 10,
  },
  title_text: {
    fontFamily: "Arimo-Bold",
    fontSize: 28,
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
  register_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  register_text: {
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

export default Register;
