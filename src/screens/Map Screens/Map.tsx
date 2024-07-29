import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import MapView, {
  Marker,
  Polyline,
  Polygon,
  PROVIDER_GOOGLE,
  Callout,
} from "react-native-maps";

import BackButton from "../components/BackButton/BackButton";
import {
  DateTimeDisplay,
  sortEventsByTime,
} from "../shared/contexts/DateTimeContext";
import { Dropdown } from "react-native-element-dropdown";
import { useUserData } from "../shared/contexts/UserDataContext";
import AddButton from "../Trips Screens/AddButton";

const Map = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { userData } = useUserData();
  const [selectedTrip, setSelectedTrip] = useState<string>("");
  const [dayNames, setDayNames] = useState<{ label: string; value: string }[]>([
    { label: "-", value: "" },
  ]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [days, setDays] = useState<EventData[][]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [showCallouts, setShowCallouts] = useState(true);

  useEffect(() => {
    if (selectedTrip == "") {
      setSelectedDay("");
    } else {
      const newDayNames = getDayNames();
      if (newDayNames) {
        setDayNames(newDayNames);
      }
    }
  }, [selectedTrip]);

  useEffect(() => {
    if (selectedDay == "") {
      setEvents([]);
      if (selectedTrip != "") {
        setDays(
          Array.from(userData.trips.values()).flatMap((value) => {
            return Array.from(value.days.values());
          })
        );
      }
    } else {
      setDays([]);
      setEvents(
        sortEventsByTime(
          Array.from(
            userData.trips.get(selectedTrip)?.days.get(selectedDay) ?? []
          )
        )
      );
      console.log(events);
    }
  }, [selectedDay]);

  useEffect(() => {
    for (const event of events) {
      if (
        event.geometry.lat != undefined &&
        event.geometry.lng != undefined &&
        event.geometry.lat != 0 &&
        event.geometry.lng != 0
      ) {
        this.mapView.animateToRegion(
          {
            latitude: events[0]?.geometry.lat ?? 0,
            longitude: events[0]?.geometry.lng ?? 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1200
        );
        return;
      }
    }
  }, [events]);

  const trip_names = [
    { label: "-", value: "" },
    ...Array.from(userData.trips.keys()).map((trip_name) => ({
      label: trip_name,
      value: trip_name,
    })),
  ];

  const getDayNames = () => {
    const currentTrip = userData.trips.get(selectedTrip)!;
    if (currentTrip != undefined) {
      return [
        { label: "-", value: "" },
        ...Array.from(currentTrip.days.keys()).map((day_name, index) => ({
          label: `Day ${index + 1} (` + day_name + `)`,
          value: day_name,
        })),
      ];
    }
  };

  const handleNavBack = async () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/resetPassword_background.png")}
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
            <Text style={styles.title_text}>Map</Text>
            <View style={styles.date_time_display_container}>
              <DateTimeDisplay />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: "5%",
                marginVertical: 5,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
            </View>
          </View>
          <Dropdown
            style={styles.dropdown}
            search
            searchPlaceholder={"Search..."}
            placeholder="Select trip"
            placeholderStyle={styles.placeholderStyle1}
            selectedTextStyle={styles.selected_text1}
            itemTextStyle={styles.items_text}
            data={trip_names}
            onChange={(item) => setSelectedTrip(item.value)}
            labelField="label"
            valueField="value"
            value={selectedTrip}
          />
          <Dropdown
            style={styles.dropdown}
            search
            searchPlaceholder={"Search..."}
            placeholder="Select trip"
            placeholderStyle={styles.placeholderStyle1}
            selectedTextStyle={styles.selected_text1}
            itemTextStyle={styles.items_text}
            data={dayNames}
            onChange={(item) => {
              setSelectedDay(item.value);
            }}
            labelField="label"
            valueField="value"
            value={selectedDay}
          />
          <View
            style={{
              flex: 1,
              width: "95%",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <MapView
              ref={(ref) => (this.mapView = ref)}
              style={{ height: "100%", width: "100%" }}
              provider={PROVIDER_GOOGLE}
              mapType={"hybrid"}
              showsUserLocation={true}
            >
              {events
                .filter(
                  (value) => value.geometry.lat != 0 || value.geometry.lng != 0
                )
                .map((value, index) => (
                  <>
                    <Marker
                      title={index + 1 + ". " + value.title}
                      key={value.toString() + "marker-" + index + value.title}
                      coordinate={{
                        latitude: value.geometry.lat,
                        longitude: value.geometry.lng,
                      }}
                    />
                    <Polyline
                      key={"polyline-" + index + value.title}
                      coordinates={events
                        .filter(
                          (value) =>
                            value.geometry.lat != 0 || value.geometry.lng != 0
                        )
                        .map((value) => {
                          return {
                            latitude: value.geometry.lat,
                            longitude: value.geometry.lng,
                          };
                        })}
                      strokeWidth={3}
                      strokeColor="red"
                      lineCap={"round"}
                    />
                  </>
                ))}
            </MapView>
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
    width: "95%",
    backgroundColor: "white",
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 2,
  },
  placeholderStyle1: { color: "#7D7D7D", fontSize: 14, marginLeft: 15 },
  selected_text1: { color: "black", fontSize: 14, marginLeft: 15 },
  items_text: { color: "black", fontSize: 14 },
});

export default Map;
