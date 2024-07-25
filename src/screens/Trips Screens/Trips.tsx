import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import AddTrip from "../components/Banner/TripFiles/AddTrip";
import AddButton from "./AddButton";
import BackButton from "../components/BackButton/BackButton";
import TripBanner from "../components/Banner/TripFiles/TripBanner";
import { useUserData } from "../shared/contexts/UserDataContext";
import { UserData, updateUserData } from "../shared/UserDataService";
import {
  useDate,
  DateTimeDisplay,
  convertToStartDate,
  hasConflictingDates,
  sortTripsByDate,
  isWithinDateRange,
  getUTCTime,
} from "../shared/contexts/DateTimeContext";

const Trips = () => {
  // Typing for navigation
  type RootStackParamList = {
    Home: undefined;
    Trips: { openForm?: boolean };
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Data
  const { date } = useDate();
  const { userData, setUserData } = useUserData();
  const [trips, setTrips] = useState<TripData[]>([]);
  const [currentTrips, setCurrentTrips] = useState<string[]>([]);

  const today = useMemo(() => getUTCTime().toISOString().split("T")[0], [date]);

  useEffect(() => {
    let newCurrentTrips = [];
    for (const trip of userData.trips.values()) {
      if (
        isWithinDateRange(convertToStartDate(new Date()), trip.start, trip.end)
      ) {
        newCurrentTrips.push(trip.title);
      }
    }
    setCurrentTrips(newCurrentTrips);
  }, [userData, today]);

  useEffect(() => {
    setTrips(sortTripsByDate(Array.from(userData.trips.values())));
  }, [userData]);

  // Add Event form
  const [isModalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);

    if (!isModalVisible) {
      // If modal is about to become visible, start zoom animation
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true, // For smoother animation
      }).start();
    } else {
      Animated.spring(scaleValue, {
        // Reverse the animation on hiding
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  // Defining button presses
  const handleNavBack = () => {
    navigation.navigate("Home");
  };
  const updateAsync = async (newTrip: TripData) => {
    const handleTripAddition = () => {
      setUserData((prevUserData: UserData) => {
        const newTrips = new Map(prevUserData.trips);
        newTrips.set(newTrip._id!, newTrip);
        const updatedUserData = { ...prevUserData, trips: newTrips, _id: prevUserData._id };
        updateUserData(updatedUserData);
        return updatedUserData;
      });
    };
    if (hasConflictingDates(trips, newTrip.start, newTrip.end)) {
      Alert.alert(
        "Conflicting Dates",
        "Having overlapping trips may break certain features. Continue adding?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () => {
              handleTripAddition();
            },
          },
        ]
      );
    } else {
      handleTripAddition();
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/resetPassword_background.png")}
      style={styles.page_background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Modal isVisible={isModalVisible}>
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
            }}
          >
            <AddTrip toggleModal={toggleModal} updateAsync={updateAsync} />
          </Animated.View>
        </Modal>
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
            <Text style={styles.title_text}>Trips</Text>
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
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "black",
              marginVertical: 5,
              alignSelf: "center",
              borderColor: "black",
              borderWidth: 8,
            }}
          >
            {currentTrips.length > 0 ? (
              currentTrips.length > 1 ? (
                <>
                  <Text style={{ fontFamily: "Arimo-Bold", color: "white" }}>
                    {"Current Trips: "}
                  </Text>
                  <Text style={{ fontFamily: "Arimo-Regular", color: "white" }}>
                    {currentTrips.join(" | ")}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontFamily: "Arimo-Bold", color: "white" }}>
                    {"Current Trip: "}
                  </Text>
                  <Text style={{ fontFamily: "Arimo-Regular", color: "white" }}>
                    {currentTrips}
                  </Text>
                </>
              )
            ) : (
              <Text style={{ fontFamily: "Arimo-Bold", color: "white" }}>
                {"No current trips"}
              </Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              width: "95%",
              marginTop: 5,
              alignItems: "center",
            }}
          >
            <ScrollView
              style={styles.banner_container}
              overScrollMode="never"
              bounces={false}
            >
              {trips.map((datapack) => (
                <TripBanner key={datapack.title} data={datapack} />
              ))}
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                {trips.length === 0 ? (
                  <Text style={{ fontFamily: "Arimo-Bold", color: "#404040" }}>
                    No trips added yet
                  </Text>
                ) : null}
              </View>
            </ScrollView>
            <View style={{ width: "95%", marginTop: "5%" }}>
              <AddButton
                onPressFunction={toggleModal}
                text={
                  Array.from(userData.trips.values()).length === 0
                    ? "Add your first trip!"
                    : "Add another trip"
                }
              />
            </View>
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
  banner_container: {
    width: "95%",
  },
  button_container: { marginTop: 10, position: "absolute" },
  textStyle: {},
});

export default Trips;
