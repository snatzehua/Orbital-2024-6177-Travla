import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
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
import CommonStyles from "../shared/CommonStyles";

const Profile = () => {
  // Data
  const { userData, setUserData } = useUserData();
  const UID = getAuth().currentUser?.uid;
  const email = getAuth().currentUser?.email;
  const [displayEventDetailsState, setDisplayEventDetailsState] = useState(
    userData.settings.displayEventDetails
  );
  const [displayUpcomingEvents, setDisplayUpcomingEvents] = useState(
    userData.settings.displayUpcomingEvents
  );

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

  const handlePasswordResetEmail = async () => {
    // Check fields are filled
    if (email != null && email != "") {
      try {
        const auth = getAuth();
        const userCredential = await sendPasswordResetEmail(auth, email);
        Alert.alert(
          "Sent Reset Email",
          "Password reset email has been sent.\nPlease check your inbox."
        );
        // Check for cases
      } catch (error: any) {
        Alert.alert("Error Detected", error);
      }
    } else {
      Alert.alert(
        "Email not Detected",
        "Please try again after restarting the application"
      );
    }
  };

  const handleSettingsBooleanChange = (key: keyof typeof userData.settings) => {
    return (newValue: boolean) =>
      setUserData((prevUserData) => {
        const changedSetting = !userData.settings[key];
        const updatedUserData = {
          ...prevUserData,
          settings: {
            ...prevUserData.settings,
            [key]: changedSetting,
          },
        };
        console.log("Set to:", changedSetting);
        updateUserData(updatedUserData);
        return updatedUserData;
      });
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
          <ScrollView
            bounces={false}
            overScrollMode="never"
            style={{
              flex: 1,
              width: "95%",
              marginTop: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: "2.5%",
                marginVertical: 5,
              }}
            >
              <View style={{ flex: 1, height: 2, backgroundColor: "black" }} />
              <View>
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontSize: Dimensions.get("window").height * 0.022,
                    fontFamily: "Arimo-Bold",
                    marginHorizontal: "2.5%",
                  }}
                >
                  USER
                </Text>
              </View>
              <View style={{ flex: 1, height: 2, backgroundColor: "black" }} />
            </View>
            <View style={styles.component_background}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.settings_header}>UID: </Text>
                <Text>{UID}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.settings_header}>Email: </Text>
                <Text>{email}</Text>
              </View>
            </View>
            <CustomButton
              text="Request password reset"
              onPress={handlePasswordResetEmail}
              containerStyle={styles.logout_container}
              textStyle={styles.logout_text}
            />
            <View style={{ height: "4%" }} />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: "2.5%",
                marginVertical: 5,
              }}
            >
              <View style={{ flex: 1, height: 2, backgroundColor: "black" }} />
              <View>
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontSize: Dimensions.get("window").height * 0.022,
                    fontFamily: "Arimo-Bold",
                    marginHorizontal: "2.5%",
                  }}
                >
                  SETTINGS
                </Text>
              </View>
              <View style={{ flex: 1, height: 2, backgroundColor: "black" }} />
            </View>
            <View style={styles.component_background}>
              <Text style={styles.settings_header}>Display Event Details</Text>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ flexShrink: 1, marginRight: 5 }}>
                  Allows the display of additional information of Events, such
                  as location and cost.
                </Text>
                <Switch
                  style={{ alignSelf: "flex-end" }}
                  trackColor={{ false: "#767577", true: "#FFB000" }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleSettingsBooleanChange(
                    "displayEventDetails"
                  )}
                  value={userData.settings.displayEventDetails}
                />
              </View>
            </View>
            <View style={styles.component_background}>
              <Text style={styles.settings_header}>
                Display Upcoming Events
              </Text>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ flexShrink: 1, marginRight: 5 }}>
                  Allows the display of upcoming Events on the home screen along
                  with current Events
                </Text>
                <Switch
                  style={{ alignSelf: "flex-end" }}
                  trackColor={{ false: "#767577", true: "#FFB000" }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleSettingsBooleanChange(
                    "displayUpcomingEvents"
                  )}
                  value={userData.settings.displayUpcomingEvents}
                />
              </View>
            </View>
            <View style={styles.component_background}>
              <Text style={styles.settings_header}>Domestic Currency:</Text>
              <Text style={{ flexShrink: 1, marginRight: 5, marginBottom: 5 }}>
                Currency in which finances are displayed
              </Text>
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
                value={userData.settings.domesticCurrency}
              />
            </View>
            <CustomButton
              text="Logout"
              onPress={handleLogout}
              wrapperStyle={{}}
              containerStyle={styles.logout_container}
              textStyle={styles.logout_text}
            />
            <CustomButton
              text="Clear All Data (Press and Hold)"
              onPress={() => {}}
              onLongPress={handleClearData}
              wrapperStyle={{}}
              containerStyle={styles.clear_items_container}
              textStyle={styles.clear_items_text}
            />
          </ScrollView>
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
  component_background: {
    ...CommonStyles.perfect_shadows,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    backgroundColor: "#EFEFEF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 20,
  },
  white_background: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 8,
  },
  settings_header: { fontFamily: "Arimo-Bold", marginBottom: 5 },
  dropdown: {
    alignSelf: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 5,
    paddingVertical: 3,
  },
  placeholderStyle1: {
    color: "black",
    fontSize: 14,
    marginLeft: 15,
  },
  selected_text1: { color: "black", fontSize: 14, marginLeft: 15 },
  items_text: { color: "black", fontSize: 14 },
  logout_container: {
    backgroundColor: "#FFB000",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  logout_text: {
    color: "black",
    fontFamily: "Arimo-Bold",
  },
  clear_items_container: {
    backgroundColor: "#E62E00",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  clear_items_text: {
    color: "white",
    fontFamily: "Arimo-Bold",
  },
});

export default Profile;
