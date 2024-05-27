import React from "react";
import { SafeAreaView, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

const Home = () => {
  type RootStackParamList = {
    Home: undefined;
    Auth: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView>
      <Button title="Go to login" onPress={() => navigation.navigate("Auth")} />
      <Text>Title</Text>
    </SafeAreaView>
  );
};

export default Home;
