import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Button } from "@rneui/base";

const Settings = () => {
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  buttonStyle: {},
  textStyle: {},
});

export default Settings;
