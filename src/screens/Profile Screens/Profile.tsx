import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Button } from "@rneui/base";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "../components/CustomButtom/CustomButton";

const Profile = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavBack = async () => {
    navigation.goBack();
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Optional: Clear any other local user data
      await AsyncStorage.removeItem("userToken"); // Or any other relevant keys
    } catch (error) {
      console.error("Error logging out:", error);
      // Potentially handle errors with a user-friendly message
    }
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginLeft: "2%", alignItems: "flex-start" }}>
        <Button
          icon={{
            name: "arrow-left",
            type: "font-awesome", // Specify the icon type
            size: 40,
            color: "black",
          }}
          type="clear"
          containerStyle={[styles.container, styles.buttonStyle]}
          titleStyle={styles.textStyle}
          onPress={handleNavBack}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomButton text="Logout" onPress={handleLogout} wrapperStyle={{}} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttonStyle: {},
  textStyle: {},
});

export default Profile;
