import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import AddEvent from "../components/Banner/EventFiles/AddEvent";
import MenuBar from "./MenuBar";
import EventBanner from "../components/Banner/EventFiles/EventBanner";
import { updateUserData } from "../shared/UserDataService";
import { useUserData } from "../shared/contexts/UserDataContext";
import {
  DateTimeDisplay,
  useDate,
  convertToStartDate,
  isWithinDateRange,
  sortEventsByTime,
  getUTCTime,
} from "../shared/contexts/DateTimeContext";
import AddButton from "../Trips Screens/AddButton";

const Home = () => {
  // Data
  const [refreshing, setRefreshing] = useState(false);
  const { userData, setUserData } = useUserData();
  const [currentTrips, setCurrentTrips] = useState<string[]>([]);
  const [accommodation, setAccommodation] = useState<string[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [upcoming, setUpcoming] = useState<EventData[]>([]);
  const [upcomingDate, setUpcomingDate] = useState("");
  const { date } = useDate();

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

  const today = useMemo(() => getUTCTime().toISOString().split("T")[0], [date]);

  useEffect(() => {
    // Check for today's events (works for multiple trips)
    const tripArray = Array.from(userData.trips.values());
    const currentEvents = tripArray.flatMap(
      (tripData) => tripData.days.get(today) || []
    );
    const currentAccommodations = tripArray.flatMap(
      (tripData) => tripData.accommodation.get(today)?.name || []
    );
    setAccommodation(currentAccommodations);
    setEvents(sortEventsByTime(currentEvents));
    // Check for upcoming events
    if (userData.settings.displayUpcomingEvents) {
      const instancedDate = convertToStartDate(getUTCTime());
      const nextWeek = getUTCTime();
      nextWeek.setDate(instancedDate.getDate() + 7);
      while (instancedDate <= nextWeek) {
        instancedDate.setDate(instancedDate.getDate() + 1); // Move to the next day
        const dateKey = instancedDate.toISOString().slice(0, -14); // YYYY-MM-DD
        const upcomingEvents = tripArray.flatMap(
          (tripData) => tripData.days.get(dateKey) || []
        );
        if (upcomingEvents.length != 0) {
          setUpcoming(upcomingEvents);
          setUpcomingDate(dateKey);
          break;
        } else {
          setUpcoming([]);
          setUpcomingDate("");
        }
      }
    }
    // Check for current running trips (works for multiple trips)
    let newCurrentTrips = [];
    for (const trip of userData.trips.values()) {
      if (
        isWithinDateRange(
          convertToStartDate(getUTCTime()),
          trip.start,
          trip.end
        )
      ) {
        newCurrentTrips.push(trip.title);
      }
    }
    setCurrentTrips(newCurrentTrips);
  }, [userData, today]);

  // Currently unused
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  const updateAsync = async (
    selectedTrip: string,
    selectedDate: string,
    newEvent: EventData
  ) => {
    setUserData((prevUserData) => {
      const updatedTrip = { ...prevUserData.trips.get(selectedTrip)! };
      const updatedDays = new Map(updatedTrip.days);

      // Get existing events for the selected date, or an empty array if none exist
      const existingEvents = updatedDays.get(selectedDate) || [];

      // Add the new event to the existing events
      const newEvents = [...existingEvents, newEvent];

      updatedDays.set(selectedDate, newEvents);
      const updatedUserData = {
        ...prevUserData,
        trips: new Map(prevUserData.trips).set(selectedTrip, {
          ...updatedTrip,
          days: updatedDays,
        }),
      };
      updateUserData(updatedUserData);
      return updatedUserData;
    });
  };

  // Main Home screen framework
  return (
    <ImageBackground
      source={require("../../../assets/images/login_background.png")}
      style={styles.page_background}
    >
      <View style={{ flex: 1 }}>
        <Modal isVisible={isModalVisible}>
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
            }}
          >
            <AddEvent toggleModal={toggleModal} updateAsync={updateAsync} />
          </Animated.View>
        </Modal>
        <SafeAreaView style={styles.container}>
          <View style={styles.title_container}>
            <Text style={styles.title_text}>Home</Text>
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
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "white",
              alignSelf: "center",
              borderColor: "white",
              borderWidth: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                color: "black",
              }}
            >
              Accommodation:{" "}
              {accommodation.length == 0 ? "None" : accommodation.join(" | ")}
            </Text>
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              overScrollMode="never"
              bounces={false}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                {events.length === 0 ? (
                  currentTrips.length != 0 ? (
                    <Text
                      style={{ fontFamily: "Arimo-Bold", color: "#404040" }}
                    >
                      No events added
                    </Text>
                  ) : (
                    <Text
                      style={{ fontFamily: "Arimo-Bold", color: "#404040" }}
                    >
                      No events today
                    </Text>
                  )
                ) : (
                  <>
                    <View style={{ marginBottom: 10 }}>
                      {events.map((datapack) => (
                        <EventBanner
                          key={datapack.title}
                          data={datapack}
                          displayEventDetails={
                            userData.settings.displayEventDetails
                          }
                        />
                      ))}
                    </View>
                    <Text
                      style={{ fontFamily: "Arimo-Bold", color: "#404040" }}
                    >
                      No more events today
                    </Text>
                  </>
                )}
              </View>
              {userData.settings.displayUpcomingEvents &&
              upcoming.length != 0 ? (
                <View
                  style={{
                    backgroundColor: "#F8F8F8",
                    width: "100%",
                    alignItems: "center",
                    marginTop: 20,
                    borderRadius: 10,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      paddingVertical: 7,
                    }}
                  >
                    <Text style={{ fontFamily: "Arimo-Bold" }}>
                      Upcoming Events on {upcomingDate}
                    </Text>
                  </View>
                  <View style={{ width: "95%" }}>
                    {upcoming.map((datapack) => (
                      <EventBanner
                        key={datapack.title}
                        data={datapack}
                        displayEventDetails={
                          userData.settings.displayEventDetails
                        }
                      />
                    ))}
                  </View>
                </View>
              ) : null}
              <View style={{ height: 15 }} />
            </ScrollView>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}></View>
          {true ? (
            <View style={{ width: "95%" }}>
              <AddButton onPressFunction={() => {}} text={"debuggerButton"} />
            </View>
          ) : null}
          <MenuBar toggleModal={toggleModal} />
        </SafeAreaView>
      </View>
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
  add_event_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
    marginBottom: "5%",
  },
  add_event_text: {
    fontFamily: "Arimo-Bold",
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
