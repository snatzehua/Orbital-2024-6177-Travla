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
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButtom";

const ResetPassword = () => {
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
  const [error, setError] = useState("");

  // Defining button press functions
  const handlePasswordResetEmail = async () => {
    // Check fields are filled
    if (email == "") {
      setError("Please fill in your email");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await sendPasswordResetEmail(auth, email);
      setError("");
      // Check for cases
    } catch (error: any) {
      setError(error.message);
    }
  };

  const pressLoginButton = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/resetPassword_background.png")}
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
              <Text style={styles.title_text}>Forgot your Password?</Text>
              <Text style={styles.title_subtext}>
                Just enter your registered email below and we'll{"\n"}send you a
                link to reset your password.
              </Text>
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
              onSubmitEditing={handlePasswordResetEmail}
            />
            <CustomButton
              text="Request password reset"
              onPress={handlePasswordResetEmail}
              containerStyle={styles.passwordReset_container}
              textStyle={styles.passwordRest_text}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.redirect_text}>Remember your password? </Text>
            <CustomButton
              text="Login"
              onPress={pressLoginButton}
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
    alignItems: "center",
  },
  title_text: {
    fontFamily: "Arimo-Bold",
    fontSize: 28,
  },
  title_subtext: {
    fontFamily: "Arimo-Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
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
  passwordReset_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  passwordRest_text: {
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

export default ResetPassword;
