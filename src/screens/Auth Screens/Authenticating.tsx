import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import CustomButton from "../components/CustomButtom";

const Authenticating = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Defining button press functions
  const pressRedirectButton = () => {
    navigation.navigate("Login");
  };

  // Animation
  const spinValue = new Animated.Value(0);
  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };
  useEffect(() => {
    spin();
  }, []);
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ImageBackground
      source={require("../../../assets/images/authentication_background.png")}
      style={styles.page_background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.text}>Authenticating...</Text>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Image
              style={styles.loading}
              source={require("../../../assets/images/loadingCircle.png")}
            />
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.redirect_text}>Didn't get redirected? </Text>
          <CustomButton
            text="Login"
            onPress={pressRedirectButton}
            wrapperStyle={{}}
            containerStyle={styles.redirect_container}
            textStyle={styles.link_text}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  page_background: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  text: {
    fontFamily: "Arimo-Bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 25,
  },
  loading: {
    resizeMode: "contain",
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").width * 0.2,
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

export default Authenticating;
