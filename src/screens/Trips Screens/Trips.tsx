import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Button } from "@rneui/base";

import Trip, { TripData } from "../components/Trip";

const Trips = () => {
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

  const ActiveBanners: TripData[] = [
    {
      title: "Trip1",
      startDate: new Date(),
      endDate: new Date(),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          marginLeft: "2%",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        <Button
          icon={{
            name: "arrow-left",
            type: "font-awesome", // Specify the icon type
            size: 40,
            color: "black",
          }}
          type="clear"
          containerStyle={styles.button_container}
          titleStyle={styles.textStyle}
          onPress={handleNavBack}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.title_container}>
          <Text style={styles.title_text}>Trips</Text>
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
          <ScrollView style={styles.banner_container}>
            {ActiveBanners.map((datapack) => (
              <Trip key={datapack.title} data={datapack} />
            ))}
          </ScrollView>
        </View>
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
  banner_container: {
    width: "95%",
  },
  button_container: { position: "absolute" },
  textStyle: {},
});

export default Trips;
