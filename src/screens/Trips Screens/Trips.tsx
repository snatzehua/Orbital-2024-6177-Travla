import React, { useRef, useState } from "react";
import {
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
import Banner from "../components/Banner";
import DateTimeDisplay from "../Home/DateTimeDisplay";

const Trips = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Data
  const [trips, setTrips] = useState<TripData[]>([]);

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
    navigation.goBack();
  };
  const handleAddEventPopup = () => {
    toggleModal();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal isVisible={isModalVisible}>
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
          }}
        >
          <AddTrip toggleModal={toggleModal} setTrips={setTrips} />
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
            {trips.map((datapack) => (
              <Banner key={datapack.title} data={datapack} />
            ))}
            <AddTripButton
              toggleModal={toggleModal}
              text={
                trips.length === 0 ? "Add your first trip!" : "Add another trip"
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
    marginTop: 5,
  },
  banner_container: {
    width: "95%",
  },
  button_container: { position: "absolute" },
  textStyle: {},
});

export default Trips;
