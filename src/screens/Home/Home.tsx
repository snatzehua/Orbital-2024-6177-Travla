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

import AddEvent from "./AddEvent";
import Banner, { EventData } from "../components/Banner";
import DateTimeDisplay from "./DateTimeDisplay";
import MenuBar from "./MenuBar";

const Home = () => {
  // Data
  const [events, setEvents] = useState<EventData[]>([]);

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

  // Main Home screen framework
  return (
    <View style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
      <Modal isVisible={isModalVisible}>
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
          }}
        >
          <AddEvent toggleModal={toggleModal} setEvents={setEvents} />
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
            {events.map((datapack) => (
              <Banner key={datapack.title} data={datapack} />
            ))}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              {events.length === 0 ? (
                <Text style={{ fontFamily: "Arimo-Bold", color: "#7D7D7D" }}>
                  No events today
                </Text>
              ) : (
                <Text style={{ fontFamily: "Arimo-Bold", color: "#7D7D7D" }}>
                  No more events today
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}></View>
        <MenuBar toggleModal={toggleModal} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 5,
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
