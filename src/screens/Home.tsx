import React from "react";
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "./components/CustomButtom/CustomButton";

const Home = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Defining button press functions
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
    <SafeAreaView style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.title_text}>Home</Text>
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
      <View style={{ flex: 1, backgroundColor: "gray" }}>
        <Text>test</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CustomButton text="Logout" onPress={handleLogout} wrapperStyle={{}} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default Home;
