import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Currencies } from "../shared/data/Currencies";
import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import { DateTimeDisplay } from "../shared/contexts/DateTimeContext";
import {
  createEmptyUserData,
  clearUserData,
  updateUserData,
} from "../shared/UserDataService";
import { useUserData } from "../shared/contexts/UserDataContext";

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

  const handleDomesticCurrencyChange = (newCurrency: string) => {
    setUserData((prevUserData) => {
      const domesticCurrency = prevUserData.settings.domesticCurrency;
      const updatedUserData = {
        ...prevUserData,
        settings: {
          ...prevUserData.settings,
          domesticCurrency: newCurrency,
        },
      };
      console.log("Set to:", newCurrency);
      updateUserData(updatedUserData);
      return updatedUserData;
    });
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/register_background.png")}
      style={styles.page_background}
    >
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
            <View style={styles.date_time_display_container}>
              <DateTimeDisplay />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: "5%",
                marginTop: 5,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
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
            <CustomButton
              text="Display details toggle"
              onPress={() => {
                setUserData((prevUserData) => {
                  const currentDisplayEventDetails =
                    prevUserData.settings.displayEventDetails;
                  const updatedUserData = {
                    ...prevUserData,
                    settings: {
                      ...prevUserData.settings,
                      displayEventDetails: !currentDisplayEventDetails,
                    },
                  };
                  console.log("Set to:", !currentDisplayEventDetails);
                  updateUserData(updatedUserData);
                  return updatedUserData;
                });
              }}
              wrapperStyle={{}}
            />
            <CustomButton
              text="Display upcoming events toggle"
              onPress={() => {
                setUserData((prevUserData) => {
                  const currentDisplayUpcomingEvents =
                    prevUserData.settings.displayUpcomingEvents;
                  const updatedUserData = {
                    ...prevUserData,
                    settings: {
                      ...prevUserData.settings,
                      displayUpcomingEvents: !currentDisplayUpcomingEvents,
                    },
                  };
                  console.log("Set to:", !currentDisplayUpcomingEvents);
                  updateUserData(updatedUserData);
                  return updatedUserData;
                });
              }}
              wrapperStyle={{}}
            />
            <Dropdown
              style={styles.dropdown}
              search
              searchPlaceholder={"Search..."}
              placeholder="-"
              placeholderStyle={styles.placeholderStyle1}
              selectedTextStyle={styles.selected_text1}
              itemTextStyle={styles.items_text}
              data={Currencies}
              onChange={(item) => handleDomesticCurrencyChange(item.value)}
              labelField="label"
              valueField="value"
            />
            <Text>Domestic Currency: {userData.settings.domesticCurrency}</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  page_background: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  button_container: { marginTop: 10, position: "absolute" },
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
  date_time_display_container: {
    backgroundColor: "#1C355B",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  dropdown: {
    width: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 5,
  },
  placeholderStyle1: {
    color: "black",
    fontSize: 14,
    marginLeft: 15,
  },
  selected_text1: { color: "black", fontSize: 14, marginLeft: 15 },
  items_text: { color: "black", fontSize: 14 },
});

export default Profile;
