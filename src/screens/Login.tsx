import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButtom";

const pressLoginButton = () => {
  console.warn("Login pressed");
};

const pressForgotPasswordButton = () => {
  console.warn("Forgot password pressed");
};

const Login = () => {
  const { height } = useWindowDimensions();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
      source={require("../../assets/login_background.png")}
      style={styles.page_background}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo2.png")}
          />
          <CustomInput
            value={username}
            setValue={setUsername}
            placeholder="Username"
            secureTextEntry={false}
          />
          <CustomInput
            value={password}
            setValue={setPassword}
            placeholder="Password"
            secureTextEntry={true}
          />
          <CustomButton
            text="Login"
            onPress={pressLoginButton}
            containerStyle={styles.login_container}
            textStyle={styles.login_text}
          />
          <CustomButton
            text="Forgot password?"
            onPress={pressForgotPasswordButton}
            textStyle={styles.forgotPassword_text}
          />
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
    marginBottom: "5%",
  },
  login_container: {
    backgroundColor: "#FFB000",
    width: "90%",

    borderColor: "#FFB000",
    borderRadius: 5,
    alignItems: "center",

    padding: 10,
    marginTop: 15,
  },
  login_text: {
    fontFamily: "Arimo-Bold",
  },
  forgotPassword_text: {
    fontFamily: "Arimo-Regular",
    color: "#7D7D7D",
  },
});

export default Login;
