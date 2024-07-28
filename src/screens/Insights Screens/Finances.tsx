import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Animated,
  Button,
  Dimensions,
  ImageBackground,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import BackButton from "../components/BackButton/BackButton";
import CommonStyles from "../shared/CommonStyles";
import { useUserData } from "../shared/contexts/UserDataContext";
import PieChart from "../components/PieChart/PieChart";
import PieChartLegend from "../components/PieChart/PieChartLegend";
import AddButton from "../Trips Screens/AddButton";
import AddMisc from "../components/Banner/EventFiles/AddMisc";
import { updateUserData } from "../shared/UserDataService";
import { TouchableOpacity } from "react-native-gesture-handler";
import { upsertData } from "../shared/SupabaseService";

interface FinancesProps {
  trip: string;
  toggleFinances: () => Promise<void>;
}

const Finances: React.FC<FinancesProps> = ({ trip, toggleFinances }) => {
  const { uid, exchangeRate, userData, setUserData } = useUserData();
  const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 });

  const [totalCost, setTotalCost] = useState(0);
  const [activityCost, setActivityCost] = useState(0);
  const [foodDrinkCost, setFoodDrinkCost] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [essentialsCost, setEssentialsCost] = useState(0);
  const [accommodationsCost, setAccommodationsCost] = useState(0);
  const [miscCost, setMiscCost] = useState(0);

  const [data, setData] = useState<
    { label: string; value: number; color: string }[]
  >([]);
  const tripData = userData.trips.get(trip);

  const [isModalVisible, setModalVisible] = useState(false);

  const scaleValue = useRef(new Animated.Value(0)).current;
  const [triggerNewRenderMarker, setTriggerNewRenderMarker] = useState(0);

  const triggerNewRender = () => {
    setTriggerNewRenderMarker(triggerNewRenderMarker + 1);
  };

  const convertCurrencies = (cost: { currency: string; amount: number }) => {
    const unconvertedCurrency = cost.currency.toLowerCase();
    const usdAmount = cost.amount / exchangeRate["usd"][unconvertedCurrency];
    const targetCurrency = userData.settings.domesticCurrency.toLowerCase();
    const finalAmount = usdAmount * exchangeRate["usd"][targetCurrency];
    return finalAmount;
  };

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

  useEffect(() => {
    const tripData = userData.trips.get(trip);
    if (tripData) {
      const allEvents = Array.from(tripData.days.values()).flat();
      const allAccommodations = Array.from(tripData.accommodation.values());
      setTotalCost(
        allEvents
          .flat()
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0)
      );
      setActivityCost(
        allEvents
          .filter((event) => event.tag === "Activity")
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0)
      );
      setFoodDrinkCost(
        allEvents
          .filter((event) => event.tag === "Food / Drink")
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0)
      );
      setTransportCost(
        allEvents
          .filter((event) => event.tag === "Transport")
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0)
      );
      setEssentialsCost(
        allEvents
          .filter((event) => event.tag === "Essentials")
          .map((value) => convertCurrencies(value.cost))
          .filter((value) => !Number.isNaN(value))
          .reduce((total: number, value: number) => total + value, 0)
      );
      setAccommodationsCost(
        allAccommodations
          .map((accommodation) => convertCurrencies(accommodation.cost))
          .filter((value) => !Number.isNaN(value))
          .map((value) => {
            console.log(value);
            return value;
          })
          .reduce((total: number, value: number) => total + value, 0)
      );
      setMiscCost(
        tripData.misc.reduce(
          (total, value) => total + convertCurrencies(value.cost),
          0
        )
      );
    }
  }, [triggerNewRenderMarker] || []);

  useEffect(() => {
    setData([
      { label: "Activity", value: activityCost, color: "#FFC107" }, // Amber (Google Yellow variant)
      { label: "Food / Drink", value: foodDrinkCost, color: "#2196F3" }, // Lighter Blue
      { label: "Transport", value: transportCost, color: "#4CAF50" }, // Slightly Darker Green
      { label: "Essentials", value: essentialsCost, color: "#F44336" }, // Google Red
      { label: "Miscellaneous", value: miscCost, color: "purple" },
      { label: "Accommodation", value: accommodationsCost, color: "grey" },
    ]);
  }, [
    totalCost,
    activityCost,
    foodDrinkCost,
    transportCost,
    essentialsCost,
    accommodationsCost,
  ]);

  const numberAsCurrency = (num: number) => {
    return userData.settings.domesticCurrency + " " + num.toFixed(2);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewDimensions({ width, height });
  };

  const handleDelete = (index: number) => {
    if (tripData) {
      const miscArray = tripData.misc;
      miscArray.splice(index, 1);
      updateUserData(userData);
      upsertData(uid, userData);
      triggerNewRender();
    }
  };

  const updateAsync = async (newMisc: Miscellaneous) => {
    if (tripData) {
      const miscArray = tripData.misc;
      miscArray.push(newMisc);
      miscArray.sort(
        (a, b) => convertCurrencies(b.cost) - convertCurrencies(a.cost)
      );
      triggerNewRender();
      updateUserData(userData);
      upsertData(uid, userData);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/finances_background.png")}
      style={styles.page_background}
    >
      <Modal
        isVisible={isModalVisible}
        supportedOrientations={["portrait", "landscape"]}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
          }}
        >
          <AddMisc toggleModal={toggleModal} updateAsync={updateAsync} />
        </Animated.View>
      </Modal>
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
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.view_right}>
                      <View style={styles.white_padding}>
                        <Text style={styles.component_title}>Misc.</Text>
                        <Text style={styles.component_number}>
                          {numberAsCurrency(miscCost)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.view_left}>
                      <View style={styles.white_padding}>
                        <Text style={styles.component_title}>
                          Accommodation
                        </Text>
                        <Text style={styles.component_number}>
                          {numberAsCurrency(accommodationsCost)}
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
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                  height: "100%",
                  width: Dimensions.get("window").width,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "95%",
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
                      Miscellaneous Costs List
                    </Text>
                  </View>
                  {tripData && triggerNewRenderMarker >= 0 ? (
                    tripData.misc.length > 0 ? (
                      tripData.misc.map((value, index) => {
                        return (
                          <View
                            key={index + value.item}
                            style={{
                              ...CommonStyles.perfect_shadows,
                              alignItems: "center",
                              backgroundColor: "white",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              margin: 5,
                              marginBottom: 0,
                              padding: 5,
                              borderRadius: 10,
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text style={{ marginLeft: 5 }}>
                                {value.item}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text>
                                {userData.settings.domesticCurrency}{" "}
                                {convertCurrencies(value.cost).toFixed(2)}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                Alert.alert(
                                  "Confirm Deletion",
                                  "Delete " + '"' + value.item + '"' + "?",
                                  [
                                    {
                                      text: "Cancel",
                                      style: "cancel",
                                    },
                                    {
                                      text: "Confirm",
                                      onPress: () => {
                                        handleDelete(index);
                                      },
                                    },
                                  ]
                                );
                              }}
                              style={{
                                backgroundColor: "red",
                                paddingVertical: 3,
                                paddingHorizontal: 6,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Arimo-Bold",
                                  color: "white",
                                }}
                              >
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    ) : null
                  ) : (
                    <Text>Error</Text>
                  )}
                </View>
                <View style={{ width: "95%" }}>
                  <AddButton
                    onPressFunction={toggleModal}
                    text={"Add Misc. Cost"}
                  />
                  <Text style={{ alignSelf: "center" }}>Pg 2 of 2</Text>
                </View>
              </View>
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
  view_left: { flex: 1, margin: 2, marginLeft: 0 },
  view_right: { flex: 1, margin: 2, marginRight: 0 },
  component_title: {
    fontFamily: "Arimo-Regular",
    color: "#7D7D7D",
    fontSize: 16,
    marginTop: 5,
  },
  component_number: { fontSize: 20, marginBottom: 5 },
});

export default Finances;
