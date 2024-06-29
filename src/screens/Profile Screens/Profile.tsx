import React, { useContext } from "react";
import {
  Alert,
  Dimensions,
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
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import { createEmptyUserData, clearUserData } from "../shared/UserDataService";
import { useUserData } from "../shared/UserDataContext";

const Profile = () => {
  // Data
  const { userData, setUserData } = useUserData();

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
  const handleClearData = async () => {
    Alert.alert(
      "Confirm Clear Data",
      "Are you sure you want to clear all your data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: () => {
            clearUserData();
            setUserData(createEmptyUserData());
          },
          style: "destructive", // Indicate a destructive action
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginLeft: "2%",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        <BackButton
          onPress={handleNavBack}
          containerStyle={styles.button_container}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.title_container}>
          <Text style={styles.title_text}>Profile</Text>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: "5%",
              marginTop: 5,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "#7D7D7D" }} />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: "95%",
            marginTop: 5,
            alignItems: "center",
          }}
        >
          <CustomButton
            text="Logout"
            onPress={handleLogout}
            wrapperStyle={{}}
          />
          <CustomButton
            text="CLEAR DATA"
            onPress={handleClearData}
            wrapperStyle={{}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button_container: { position: "absolute" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title_container: {
    alignItems: "center",
  },
  title_text: {
    fontFamily: "Arimo-Bold",
    fontSize: Dimensions.get("window").height * 0.05,
  },
});

export default Profile;
