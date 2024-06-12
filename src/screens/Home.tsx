import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
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

import Banner, { BannerData } from "./components/Banner";

const Home = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Settings: undefined;
    Trips: undefined;
    Map: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Data
  const ActiveBanners: BannerData[] = [
    {
      title: "Test1",
      startHour: 9,
      startMinute: 30,
      endHour: 11,
      endMinute: 30,
    },
    {
      title: "Test2",
      startHour: 7,
      startMinute: 30,
      endHour: 9,
      endMinute: 30,
    },
    {
      title: "Test3",
      startHour: 11,
      startMinute: 30,
      endHour: 13,
      endMinute: 30,
    },
  ];

  // Defining button press functions
  const handleSettingsNavigation = () => {
    navigation.navigate("Settings");
  };
  const handleTripsNavigation = () => {
    navigation.navigate("Trips");
  };
  const handleMapNavigation = () => {
    navigation.navigate("Map");
  };
  const handleProfileNavigation = () => {
    navigation.navigate("Profile");
  };
  const handleAddEvent = () => {
    console.log("Add...");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
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
              <Banner key={datapack.title} data={datapack} />
            ))}
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}></View>
        <View style={styles.menu_bar}>
          <Pressable
            onPress={handleSettingsNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../assets/images/settings_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Settings</Text>
          </Pressable>
          <Pressable
            onPress={handleTripsNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../assets/images/trips_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Trips</Text>
          </Pressable>
          <Pressable
            onPress={handleAddEvent}
            style={styles.primary_menu_button}
          >
            <Image
              source={require("../../assets/images/plus_icon.png")}
              style={styles.secondary_menu_icon}
            />
          </Pressable>
          <Pressable
            onPress={handleMapNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../assets/images/map_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Map</Text>
          </Pressable>
          <Pressable
            onPress={handleProfileNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../assets/images/profile_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Profile</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
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
  menu_bar: {
    backgroundColor: "white",
    width: "96%",
    flexDirection: "row",
    borderRadius: 30,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  primary_menu_button: {
    flexDirection: "column",
    backgroundColor: "#1C355B",
    width: "18%",
    height: Dimensions.get("window").width * 0.18,
    borderColor: "#2E4F82",
    borderWidth: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  secondary_menu_button: {
    flexDirection: "column",
    width: "16%",
    height: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  secondary_menu_icon: {
    resizeMode: "contain",
    width: "50%",
    height: Dimensions.get("window").width * 0.08,
  },
  secondary_menu_text: {
    color: "#7D7D7D",
    fontFamily: "Arimo-Bold",
    fontSize: 12,
    marginTop: 10,
  },
});

export default Home;
