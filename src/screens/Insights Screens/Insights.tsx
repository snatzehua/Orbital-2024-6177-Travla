import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { LinearGradient } from "expo-linear-gradient";
import { CalendarList } from "react-native-calendars";

import BackButton from "../components/BackButton/BackButton";
import InsightComponent from "./InsightComponent";
import Finances from "./Finances";
import Logistics from "./Logistics";
import { useUserData } from "../shared/contexts/UserDataContext";
import { DateTimeDisplay } from "../shared/contexts/DateTimeContext";
import { Dropdown } from "react-native-element-dropdown";
import Packing from "./Packing";

const Settings = () => {
  // Typing for navigation
  type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
  };
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Data
  const { userData, exchangeRate } = useUserData();
  const [selectedTrip, setSelectedTrip] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markedDates, setMarkedDates] = useState<markedDatesObject>({});

  const [totalCost, setTotalCost] = useState("");
  const [logistics, setLogistics] = useState<string[]>([]);
  const [packingList, setPackingList] = useState<string[]>([]);

  const [isFinancesVisible, setIsFinancesVisible] = useState(false);
  const [isLogisticsVisible, setIsLogisticsVisible] = useState(false);
  const [isPackingVisible, setIsPackingVisible] = useState(false);

  const trip_names = [
    { label: "-", value: "" },
    ...Array.from(userData.trips.keys()).map((trip_name) => ({
      label: trip_name,
      value: trip_name,
    })),
  ];

  useEffect(() => {
    setMarkedDates(generateMarkedDates(userData.trips, "#301934"));
  }, []);

  useEffect(() => {
    setTotalCost(getTotalCost(selectedTrip));
    setLogistics(getLogistics(selectedTrip));
    console.log("Logistics", logistics);
    setPackingList(getPackingList(selectedTrip));
    setMarkedDates((prevMarkedDates) => {
      const newMarkedDates = generateMarkedDates(userData.trips, "#301934"); // Set all dates to base color

      console.log(newMarkedDates);
      const currStart = userData.trips
        .get(selectedTrip)
        ?.start.toISOString()
        .split("T")[0];
      const currEnd = userData.trips
        .get(selectedTrip)
        ?.end.toISOString()
        .split("T")[0];

      console.log(currStart, " to ", currEnd);
      if (currStart && currEnd) {
        newMarkedDates[currStart] = {
          ...newMarkedDates[currStart], // Get properties from base color setting
          color: "#FFB000",
        };
        newMarkedDates[currEnd] = {
          ...newMarkedDates[currEnd],
          color: "#FFB000",
        };
      }
      return newMarkedDates;
    });
  }, [selectedTrip]);

  const getTotalCost = (trip_name: string) => {
    const convertCurrencies = (cost: { currency: string; amount: number }) => {
      const unconvertedCurrency = cost.currency.toLowerCase();
      const usdAmount = cost.amount / exchangeRate["usd"][unconvertedCurrency];
      const targetCurrency = userData.settings.domesticCurrency.toLowerCase();
      const finalAmount = usdAmount * exchangeRate["usd"][targetCurrency];
      return finalAmount;
    };
    const trip = userData.trips.get(trip_name);
    if (trip) {
      return (
        Array.from(trip.days.values())
          .flat()
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0) +
        Array.from(trip.accommodation.values())
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0)
      ).toFixed(2);
    }
    return "0.00";
  };

  const getLogistics = (trip_name: string) => {
    const trip = userData.trips.get(trip_name);
    if (trip) {
      return Array.from(trip.accommodation.values())
        .filter((value) => value.name == "")
        .reduce(
          (merged: string[], value: Accommodation) => [
            ...new Set([...merged, value.name]),
          ],
          []
        );
    }
    return [];
  };

  const getPackingList = (trip_name: string) => {
    const trip = userData.trips.get(trip_name);
    if (trip) {
      return Array.from(trip.days.values())
        .flat()
        .reduce(
          (merged: string[], event: EventData) => [
            ...new Set([...merged, ...event.items]),
          ],
          []
        );
    }
    return [];
  };

  // Handle button presses
  const handleNavBack = async () => {
    navigation.goBack();
  };
  const toggleFinances = async () => {
    if (selectedTrip != "") {
      setIsFinancesVisible(!isFinancesVisible);
    } else {
      Alert.alert(
        "No Trip Selected",
        "Please select a trip in the dropdown menu above to view trip insights."
      );
    }
  };
  const toggleLogistics = async () => {
    if (selectedTrip != "") {
      setIsLogisticsVisible(!isLogisticsVisible);
    } else {
      Alert.alert(
        "No Trip Selected",
        "Please select a trip in the dropdown menu above to view trip insights."
      );
    }
  };
  const togglePacking = async () => {
    if (selectedTrip != "") {
      setIsPackingVisible(!isPackingVisible);
    } else {
      Alert.alert(
        "No Trip Selected",
        "Please select a trip in the dropdown menu above to view trip insights."
      );
    }
  };

  interface markedDatesObject {
    [key: string]: any;
  }
  const generateMarkedDates = (
    trips: Map<string, TripData>,
    color: string
  ): markedDatesObject => {
    const markedDates: markedDatesObject = {};

    // Iterate through all trips in userData
    const helperFunction = (trip: TripData | undefined) => {
      if (trip == null) {
        return markedDates;
      }
      const starting = trip.start.toISOString().split("T")[0];
      const ending = trip.end.toISOString().split("T")[0];
      if (starting == ending) {
        markedDates[starting] = {
          selected: true,
          disabled: false,
          startingDay: true,
          color: color,
          endingDay: true,
        };
      } else {
        markedDates[starting] = {
          selected: true,
          disabled: false,
          startingDay: true,
          color: color,
        };
        markedDates[ending] = {
          selected: true,
          disabled: false,
          endingDay: true,
          color: color,
        };
        const currentDate = new Date(trip.start);
        currentDate.setDate(currentDate.getDate() + 1);
        while (currentDate < trip.end) {
          markedDates[currentDate.toISOString().split("T")[0]] = {
            selected: true,
            disabled: false,
            color: color + "90",
          };
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      }
      return markedDates;
    };

    if (selectedTrip == "") {
      for (const trip of trips.values()) {
        helperFunction(trip);
      }
    }
    helperFunction(trips.get(selectedTrip));
    return markedDates;
  };

  return (
    <>
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
              <Text style={styles.title_text}>Insights</Text>
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
                  style={{ flex: 1, height: 1, backgroundColor: "black" }}
                />
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
            <View
              style={{
                justifyContent: "flex-start",
                flex: 1,
                backgroundColor: "#FFFFFF85",
                width: "100%",
              }}
            >
              <View
                style={{ backgroundColor: "black", padding: 8, marginTop: 16 }}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    color: "white",
                    alignSelf: "center",
                  }}
                >
                  Trips Calendar
                </Text>
              </View>
              <CalendarList
                onDayPress={(date) => {
                  console.log(isLoading);
                  if (
                    userData.trips.get(selectedTrip)?.days.has(date.dateString)
                  ) {
                    return;
                  } else {
                    setIsLoading(true);
                    for (const [tripName, trip] of userData.trips) {
                      if (tripName == selectedTrip) {
                        continue;
                      }
                      if (trip.days.has(date.dateString)) {
                        console.log(isLoading);
                        setSelectedTrip(tripName);
                        return;
                      }
                    }
                    setSelectedTrip("");
                  }
                }}
                disabledByDefault={true}
                firstDay={1}
                hideArrows={true}
                horizontal={true}
                // Enable paging on horizontal, default = false
                pagingEnabled={true}
                style={{ marginBottom: 0 }}
                theme={{
                  textDayHeaderFontFamily: "Arimo-Bold",
                  monthTextColor: "black",
                  backgroundColor: "transparent", // Background color of the whole calendar
                  calendarBackground: "transparent",
                  textSectionTitleColor: "white",
                  selectedDayBackgroundColor: "black",
                  selectedDayTextColor: "white",
                  dayTextColor: "white",
                  textDisabledColor: "black", // Background color of the month view
                  // ... other theme properties (see documentation) ...
                }}
                calendarWidth={Dimensions.get("window").width}
                markingType={"period"}
                markedDates={markedDates}
              />
            </View>
            <LinearGradient
              colors={["#00000010", "#000000", "#00000010"]} // Your gradient colors
              start={{ x: 0, y: 0.5 }} // Start from the left edge (x: 0)
              end={{ x: 1, y: 0.5 }} // End at the right edge (x: 1)
              style={{ width: "95%", height: 1, marginTop: 10 }}
            />
            <View
              style={{
                backgroundColor: "#00000080",
                width: "100%",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <ScrollView
                horizontal={true}
                snapToAlignment="center"
                snapToInterval={Dimensions.get("screen").width * 0.8}
                decelerationRate={"fast"}
                style={{ width: "100%", paddingVertical: 10 }}
              >
                <View
                  style={{ width: Dimensions.get("screen").width * 0.15 }}
                />
                <InsightComponent
                  baseColor="#FFB000"
                  highlightColor="#FFCC33"
                  shadowColor="#FF8C00"
                  title="Finances"
                  text="Total Expenditure:"
                  subtext={
                    selectedTrip != ""
                      ? userData.settings.domesticCurrency + " " + totalCost
                      : "No trip selected"
                  }
                  onPress={toggleFinances}
                />
                <InsightComponent
                  baseColor="#4285F4"
                  highlightColor="#6EA8FE"
                  shadowColor="#2860E0"
                  title="Logistics"
                  text="Planned Logistics:"
                  subtext={
                    selectedTrip != ""
                      ? logistics.length > 0
                        ? logistics.length + " items found"
                        : "None found"
                      : "No trip selected"
                  }
                  onPress={toggleLogistics}
                />
                <InsightComponent
                  baseColor="#689F38"
                  highlightColor="#93C47D"
                  shadowColor="#457329"
                  title="Packing"
                  text="Items to bring:"
                  subtext={
                    selectedTrip != ""
                      ? packingList.length > 0
                        ? packingList.length + " items found"
                        : "None found"
                      : "No trip selected"
                  }
                  onPress={togglePacking}
                />
                <View
                  style={{ width: Dimensions.get("screen").width * 0.15 }}
                />
              </ScrollView>
            </View>
            <LinearGradient
              colors={["#00000010", "#000000", "#00000010"]} // Your gradient colors
              start={{ x: 0, y: 0.5 }} // Start from the left edge (x: 0)
              end={{ x: 1, y: 0.5 }} // End at the right edge (x: 1)
              style={{ width: "95%", height: 1, marginVertical: 10 }}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
      <Modal
        isVisible={isFinancesVisible}
        onBackdropPress={() => {
          if (selectedTrip !== "") {
            setIsFinancesVisible(false);
          }
        }}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ margin: 0 }}
      >
        <View style={{ alignItems: "flex-start" }}></View>
        <Finances trip={selectedTrip} toggleFinances={toggleFinances} />
      </Modal>
      <Modal
        isVisible={isLogisticsVisible}
        onBackdropPress={() => {
          if (selectedTrip !== "") {
            setIsLogisticsVisible(false);
          }
        }}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ margin: 0 }}
      >
        <View style={{ alignItems: "flex-start" }}></View>
        <Logistics trip={selectedTrip} toggleLogistics={toggleLogistics} />
      </Modal>
      <Modal
        isVisible={isPackingVisible}
        onBackdropPress={() => {
          if (selectedTrip !== "") {
            setIsPackingVisible(false);
          }
        }}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ margin: 0 }}
      >
        <View style={{ alignItems: "flex-start" }}></View>
        <Packing trip={selectedTrip} togglePacking={togglePacking} />
      </Modal>
    </>
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
    justifyContent: "flex-start",
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
  bottom_view: {
    marginTop: 5,
  },
  dropdown: {
    width: "90%",
    backgroundColor: "white",
    paddingVertical: 5,
    borderRadius: 20,
    marginVertical: 5,
  },
  placeholderStyle1: { color: "#7D7D7D", fontSize: 14, marginLeft: 15 },
  selected_text1: { color: "black", fontSize: 14, marginLeft: 15 },
  items_text: { color: "black", fontSize: 14 },
});

export default Settings;
