import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";

import BackButton from "../components/BackButton/BackButton";
import CommonStyles from "../shared/CommonStyles";
import { useUserData } from "../shared/contexts/UserDataContext";
import PieChart from "../components/PieChart/PieChart";
import PieChartLegend from "../components/PieChart/PieChartLegend";

interface FinancesProps {
  trip: string;
  toggleFinances: () => Promise<void>;
}

const Finances: React.FC<FinancesProps> = ({ trip, toggleFinances }) => {
  const { userData } = useUserData();
  const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 });

  const [totalCost, setTotalCost] = useState(0);
  const [activityCost, setActivityCost] = useState(0);
  const [foodDrinkCost, setFoodDrinkCost] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [essentialsCost, setEssentialsCost] = useState(0);
  const [accomodationsCost, setAccomodationsCost] = useState(0);
  const [miscCost, setMiscCost] = useState(0);

  const [data, setData] = useState<
    { label: string; value: number; color: string }[]
  >([]);
  const tripData = userData.trips.get(trip);

  useEffect(() => {
    const tripData = userData.trips.get(trip);
    if (tripData) {
      const allEvents = Array.from(tripData.days.values()).flat();
      setTotalCost(
        allEvents.reduce(
          (total: number, event: EventData) => total + event.cost.amount,
          0
        )
      );
      setActivityCost(
        allEvents
          .filter((event) => event.tag === "Activity")
          .reduce(
            (total: number, event: EventData) => total + event.cost.amount,
            0
          )
      );
      setFoodDrinkCost(
        allEvents
          .filter((event) => event.tag === "Food / Drink")
          .reduce(
            (total: number, event: EventData) => total + event.cost.amount,
            0
          )
      );
      setTransportCost(
        allEvents
          .filter((event) => event.tag === "Transport")
          .reduce(
            (total: number, event: EventData) => total + event.cost.amount,
            0
          )
      );
      setEssentialsCost(
        allEvents
          .filter((event) => event.tag === "Essentials")
          .reduce(
            (total: number, event: EventData) => total + event.cost.amount,
            0
          )
      );
    } else {
      setTotalCost(0);
      setActivityCost(0);
      setFoodDrinkCost(0);
      setTransportCost(0);
      setEssentialsCost(0);
    }
  }, []);

  useEffect(() => {
    setData([
      { label: "Activity", value: activityCost, color: "#FFC107" }, // Amber (Google Yellow variant)
      { label: "Food / Drink", value: foodDrinkCost, color: "#2196F3" }, // Lighter Blue
      { label: "Transport", value: transportCost, color: "#4CAF50" }, // Slightly Darker Green
      { label: "Essentials", value: essentialsCost, color: "#F44336" }, // Google Red
    ]);
  }, [totalCost, activityCost, foodDrinkCost, transportCost, essentialsCost]);

  const numberAsCurrency = (num: number) => {
    return "$" + num.toFixed(2);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewDimensions({ width, height });
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/finances_background.png")}
      style={styles.page_background}
    >
      <View style={{ zIndex: 1, marginTop: "15%", position: "absolute" }}>
        <BackButton onPress={toggleFinances} iconName="window-close-o" />
      </View>
      <SafeAreaView
        style={{
          alignItems: "center",
          marginLeft: 0,
          marginTop: 0,
          flex: 1,
        }}
      >
        <View style={styles.title_container}>
          <Text style={styles.title_text}>Finances</Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 3,
            backgroundColor: "black",
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderBottomWidth: 3,
          }}
        >
          <ScrollView
            horizontal={true}
            snapToInterval={Dimensions.get("window").width}
            decelerationRate={"fast"}
          >
            <View
              style={{
                flex: 1,
                width: Dimensions.get("window").width,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: "95%",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 10,
                  borderWidth: 5,
                  borderRadius: 5,
                  borderColor: "#EFEFEF",
                }}
              >
                <View style={{ backgroundColor: "#EFEFEF", width: "100%" }}>
                  <Text
                    style={{
                      fontFamily: "Arimo-Bold",
                      margin: 5,
                      marginBottom: 10,
                    }}
                  >
                    Event Cost Breakdown
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      flex: 1,
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                    onLayout={handleLayout}
                  >
                    <PieChart data={data} dimensions={viewDimensions} />
                  </View>
                  <View
                    style={[
                      { marginVertical: 10 },
                      CommonStyles.perfect_shadows,
                    ]}
                  >
                    <PieChartLegend data={data} />
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <ScrollView
                  style={{ width: "95%" }}
                  overScrollMode="never"
                  bounces={false}
                >
                  <View
                    style={[
                      styles.white_padding,
                      {
                        marginBottom: 5,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Regular",
                        color: "#7D7D7D",
                        fontSize: 20,
                        marginTop: 10,
                      }}
                    >
                      Total Expenditure
                    </Text>
                    <Text style={{ fontSize: 30, marginBottom: 10 }}>
                      {numberAsCurrency(totalCost)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.view_left}>
                      <View style={styles.white_padding}>
                        <Text style={styles.component_title}>Activity</Text>
                        <Text style={styles.component_number}>
                          {numberAsCurrency(activityCost)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.view_right}>
                      <View style={styles.white_padding}>
                        <Text style={styles.component_title}>Food / Drink</Text>
                        <Text style={styles.component_number}>
                          {numberAsCurrency(foodDrinkCost)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.view_left}>
                      <View style={styles.white_padding}>
                        <Text style={styles.component_title}>Transport</Text>
                        <Text style={styles.component_number}>
                          {numberAsCurrency(transportCost)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.view_right}>
                      <View style={styles.white_padding}>
                        <Text style={styles.component_title}>Essentials</Text>
                        <Text style={styles.component_number}>
                          {numberAsCurrency(essentialsCost)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={{ alignSelf: "center" }}>Pg 1 of 2</Text>
                </ScrollView>
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <ScrollView
                contentContainerStyle={{ flex: 1 }}
                style={{
                  height: "100%",
                  width: Dimensions.get("window").width,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text></Text>
                </View>
                <Text style={{ alignSelf: "center" }}>Pg 2 of 2</Text>
              </ScrollView>
            </View>
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
  title_container: {
    alignItems: "center",
    marginBottom: 10,
  },
  title_text: {
    fontFamily: "Arimo-Bold",
    fontSize: Dimensions.get("window").height * 0.05,
  },
  white_padding: {
    ...CommonStyles.perfect_shadows,
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderTopColor: "#FFFFFF",
    borderTopWidth: 5,
    borderRightColor: "#FFFFFF",
    borderRightWidth: 5,
    borderLeftColor: "#DCDCDC",
    borderLeftWidth: 5,
    borderBottomColor: "#DCDCDC",
    borderBottomWidth: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  view_left: { flex: 1, margin: 5, marginLeft: 0 },
  view_right: { flex: 1, margin: 5, marginRight: 0 },
  component_title: {
    fontFamily: "Arimo-Regular",
    color: "#7D7D7D",
    fontSize: 16,
    marginTop: 10,
  },
  component_number: { fontSize: 20, marginBottom: 10 },
});

export default Finances;
