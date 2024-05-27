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

import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButtom";

const Register = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
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
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // Defining button press functions
  const pressLoginButton = () => {
    navigation.navigate("Login");
  };

  const pressGoogleLoginButton = () => {
    console.warn("Google Login pressed");
  };

  const pressFacebookLoginButton = () => {
    console.warn("Google Login pressed");
  };

  return (
    <ImageBackground
      source={require("../../assets/register_background.png")}
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
            <CustomInput
              value={email}
              setValue={setEmail}
              placeholder="Email"
              secureTextEntry={false}
            />
            <CustomInput
              value={password1}
              setValue={setPassword1}
              placeholder="Create password"
              secureTextEntry={true}
            />
            <CustomInput
              value={password2}
              setValue={setPassword2}
              placeholder="Confirm password"
              secureTextEntry={true}
            />
            <CustomButton
              text="Register"
              onPress={pressLoginButton}
              containerStyle={styles.register_container}
              textStyle={styles.login_text}
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
              containerStyle={styles.login_container}
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
    margin: 20,
  },
  title_text: {
    fontFamily: "Arimo-Bold",
    fontSize: 28,
  },
  login_text: {
    fontFamily: "Arimo-Bold",
  },
  register_container: {
    backgroundColor: "#FFB000",
    width: "90%",

    borderColor: "#FFB000",
    borderRadius: 5,
    alignItems: "center",

    padding: 10,
    marginTop: 15,
  },
  login_container: {},
  link_text: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default Register;
