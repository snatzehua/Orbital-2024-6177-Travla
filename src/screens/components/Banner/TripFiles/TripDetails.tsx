import React, { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import AddButton from "../../../Trips Screens/AddButton";
import EventBanner from "../EventFiles/EventBanner";
import BackButton from "../../BackButton/BackButton";
import AddEvent from "../../../Home/AddEvent";
import { updateUserData } from "../../../shared/UserDataService";
import { useUserData } from "../../../shared/contexts/UserDataContext";

interface TripDetailsProps {
  tripData: TripData;
  isVisible: boolean;
  onClose: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  tripData,
  isVisible,
  onClose,
}) => {
  const { userData, setUserData } = useUserData();
  const events = Array.from(tripData.days.values());
  const dates = Array.from(tripData.days.keys());
  const [selectedDay, setselectedDay] = useState(1);

  // Add event form
  const [isModalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    console.log(isModalVisible);

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

  return (
    <>
      <Modal
        style={styles.modal_container}
        isVisible={isVisible}
        onBackdropPress={onClose}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={250} // Disable animation in
        animationOutTiming={1}
      >
        <ImageBackground
          source={require("../../../../../assets/images/resetPassword_background.png")}
          style={styles.page_background}
        >
          <Modal isVisible={isModalVisible}>
            <Animated.View
              style={{
                transform: [{ scale: scaleValue }],
              }}
            >
              <AddEvent toggleModal={toggleModal} updateAsync={updateAsync} />
            </Animated.View>
          </Modal>
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <View
                style={{
                  marginLeft: "2%",
                  alignItems: "flex-start",
                  zIndex: 1,
                }}
              >
                <BackButton
                  onPress={onClose}
                  containerStyle={styles.button_container}
                />
              </View>
              <View style={styles.container}>
                <View style={styles.title_container}>
                  <Text style={styles.title}>{tripData.trip} Details</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        minHeight: 20,
                        paddingVertical: 3,
                      }}
                    ></View>
                  </View>
                  <View
                    style={{
                      width: "90%",
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <View
                      style={{ flex: 1, height: 1, backgroundColor: "black" }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "100%" }}>
                    <FlatList
                      style={{ height: "100%" }}
                      data={events}
                      overScrollMode="never"
                      bounces={false}
                      snapToInterval={Dimensions.get("screen").width * 1}
                      decelerationRate={"fast"}
                      horizontal={true}
                      onScroll={(event) => {
                        const offset = event.nativeEvent.contentOffset.x;
                        const contentSize = event.nativeEvent.contentSize.width;
                        const viewSize =
                          event.nativeEvent.layoutMeasurement.width;
                        const currentDay =
                          (offset / (contentSize - viewSize)) *
                            (dates.length - 1) +
                          1;
                        setselectedDay(Math.round(currentDay));
                      }}
                      renderItem={({ item, index }) => (
                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: Dimensions.get("window").width,
                              flexDirection: "row",
                              justifyContent: "center",
                              backgroundColor: "black",
                              marginTop: 5,
                              alignSelf: "center",
                              borderColor: "black",
                              borderWidth: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Arimo-Bold",
                                color: "white",
                              }}
                            >
                              {`Day (${index + 1}/${dates.length}) - ${
                                dates[index]
                              }`}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: Dimensions.get("window").width * 0.9,
                            }}
                          >
                            <Text style={{ alignSelf: "center" }}></Text>
                            <ScrollView
                              style={{
                                height: "100%",
                                backgroundColor: "transparent",
                              }}
                              overScrollMode="never"
                              bounces={false}
                            >
                              {item.map((datapack) => (
                                <EventBanner
                                  key={datapack.title}
                                  data={datapack}
                                  displayEventDetails={true}
                                />
                              ))}
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: "center",
                                  marginTop: 10,
                                }}
                              >
                                {item.length === 0 ? (
                                  <>
                                    <Text
                                      style={{
                                        fontFamily: "Arimo-Bold",
                                        color: "#404040",
                                        marginBottom: 10,
                                      }}
                                    >
                                      ...
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: "Arimo-Bold",
                                        color: "#404040",
                                      }}
                                    >
                                      No events added for this day
                                    </Text>
                                  </>
                                ) : (
                                  <View
                                    style={{
                                      flex: 1,
                                      alignItems: "center",
                                      marginTop: 10,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily: "Arimo-Bold",
                                        color: "#404040",
                                      }}
                                    >
                                      No other events
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </ScrollView>
                          </View>
                        </View>
                      )}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{ alignSelf: "center", width: "95%", marginTop: "5%" }}
              >
                <AddButton
                  onPressFunction={() => toggleModal()}
                  text={"Add an event"}
                />
              </View>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal_container: { flex: 1, marginLeft: 0, marginTop: 0 },
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
  title: {
    fontSize: 24,
    fontFamily: "Arimo-Bold",
    marginBottom: 5,
    textAlign: "center", // Center the title text
  },
});

export default TripDetails;
