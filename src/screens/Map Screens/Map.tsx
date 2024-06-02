import React from "react";
import { SafeAreaView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Map = () => {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 20, alignItems: "flex-start" }}>
        <FontAwesome.Button
          name="arrow-left"
          color="white"
          backgroundColor="#7D7D7D"
          onPress={handleNavBack}
        >
          Back
        </FontAwesome.Button>
      </View>
    </SafeAreaView>
  );
};

export default Map;
