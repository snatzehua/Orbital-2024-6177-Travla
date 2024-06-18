import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
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

import Banner, { EventData } from "../components/Banner";
import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";

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
  const [events, setEvents] = useState<EventData[]>([]);

  // Add Event form
  const AddEventForm = () => {};
  const [isModalVisible, setModalVisible] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  const toggleModal = () => {
    console.log("Toggled");
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
  const handleAddEventPopup = () => {
    toggleModal();
  };

  // Add event popup form
  const AddEvent = () => {
    // Defining hooks
    const [newEventTitle, setNewEventTitle] = useState("");

    // Defining button press functions (Add Event)
    const handleAddEvent = () => {
      // Error handling
      if (newEventTitle === "") {
        return;
      }
      const newEvent: EventData = {
        title: newEventTitle,
        // placeholders
        datatype: "Event",
        startTime: new Date(),
        endTime: new Date(),
      };
      setEvents((list) => [...list, newEvent]);
      toggleModal();
    };
    return (
      <SafeAreaView style={{ backgroundColor: "#EBEBEB" }}>
        <View style={{ alignItems: "flex-start" }}>
          <BackButton onPress={toggleModal} iconName="window-close-o" />
        </View>
        <View style={{ alignItems: "center" }}>
          <CustomInput
            value={newEventTitle}
            setValue={setNewEventTitle}
            placeholder="Event Title"
            secureTextEntry={false}
          />
          <CustomButton
            text="Add Event"
            onPress={handleAddEvent}
            containerStyle={styles.add_event_container}
            textStyle={styles.add_event_text}
          />
        </View>
      </SafeAreaView>
    );
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
          <AddEvent />
        </Animated.View>
      </Modal>
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
            {events.map((datapack) => (
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
              source={require("../../../assets/images/settings_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Settings</Text>
          </Pressable>
          <Pressable
            onPress={handleTripsNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../../assets/images/trips_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Trips</Text>
          </Pressable>
          <Pressable
            onPress={handleAddEventPopup}
            style={styles.primary_menu_button}
          >
            <Image
              source={require("../../../assets/images/plus_icon.png")}
              style={styles.secondary_menu_icon}
            />
          </Pressable>
          <Pressable
            onPress={handleMapNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../../assets/images/map_tab.png")}
              style={styles.secondary_menu_icon}
            />
            <Text style={styles.secondary_menu_text}>Map</Text>
          </Pressable>
          <Pressable
            onPress={handleProfileNavigation}
            style={styles.secondary_menu_button}
          >
            <Image
              source={require("../../../assets/images/profile_tab.png")}
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
