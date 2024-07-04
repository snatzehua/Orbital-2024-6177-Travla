import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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

import AddTrip from "./AddTrip";
import AddTripButton from "./AddTripButton";
import BackButton from "../components/BackButton/BackButton";
import TripBanner from "../components/Banner/TripFiles/TripBanner";
import { useUserData } from "../shared/UserDataContext";
import { updateUserData } from "../shared/UserDataService";
import {
  DateTimeDisplay,
  hasConflictingDates,
  sortTripsByDate,
} from "../shared/DateTimeContext";

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
  const { userData, setUserData } = useUserData();
  const [trips, setTrips] = useState<TripData[]>([]);
  //const [selectedTrip, setSelectedTrip] = useState<string>("");

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
      setUserData((prevUserData) => {
        const newTrips = new Map(prevUserData.trips);
        newTrips.set(newTrip.title, newTrip);
        const updatedUserData = { ...prevUserData, trips: newTrips };
        updateUserData(updatedUserData);
        return updatedUserData;
      });
    };
    if (hasConflictingDates(trips, newTrip.start, newTrip.end)) {
      Alert.alert(
        "Conflicting Dates",
        "Are you sure you want to add this trip? This trip conflicts with existing trips.",
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
    <>
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
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#7D7D7D" }}
              />
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
              {trips.map((datapack) => (
                <TripBanner key={datapack.title} data={datapack} />
              ))}
              <AddTripButton
                onPressFunction={toggleModal}
                text={
                  Array.from(userData.trips.values()).length === 0
                    ? "Add your first trip!"
                    : "Add another trip"
                }
              ></AddTripButton>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginVertical: 10,
                }}
              ></View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
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
