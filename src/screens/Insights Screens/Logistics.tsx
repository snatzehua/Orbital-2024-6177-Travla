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

import BackButton from "../components/BackButton/BackButton";
import CommonStyles from "../shared/CommonStyles";
import { useUserData } from "../shared/contexts/UserDataContext";

interface LogisticsProps {
  trip: string;
  toggleLogistics: () => Promise<void>;
}

const Logistics: React.FC<LogisticsProps> = ({ trip, toggleLogistics }) => {
  const { exchangeRate, userData } = useUserData();
  const tripData = userData.trips.get(trip);

  const getDateRange = (title: string) => {
    let start = "";
    let end = "";
    if (tripData) {
      const keys = Array.from(tripData.accommodation.keys());
      const values = Array.from(tripData.accommodation.values());
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].name == title) {
          start = keys[i];
          for (let j = i; j < values.length; j += 1) {
            if (values[j].name == title) {
              end = keys[j];
            }
          }
        }
      }
      if (start == "" || end == "") {
        return ["Error", "Error"];
      }
      return [start, end];
    }
    return ["Invalid tripData", "Invalid tripData"];
  };

  const convertCurrencies = (cost: { currency: string; amount: number }) => {
    const unconvertedCurrency = cost.currency.toLowerCase();
    const usdAmount = cost.amount / exchangeRate["usd"][unconvertedCurrency];
    const targetCurrency = userData.settings.domesticCurrency.toLowerCase();
    const finalAmount = usdAmount * exchangeRate["usd"][targetCurrency];
    return finalAmount;
  };

  const getPrice = (title: string) => {
    if (tripData) {
      const accoms = Array.from(tripData.accommodation.values());
      for (const accom of accoms) {
        if (accom.name == title) {
          return convertCurrencies(accom.cost);
        }
      }
    }
    return 0;
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/logistics_background.png")}
      style={styles.page_background}
    >
      <View style={{ zIndex: 1, marginTop: "15%", position: "absolute" }}>
        <BackButton onPress={toggleLogistics} iconName="window-close-o" />
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
          <Text style={styles.title_text}>Logistics</Text>
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
                    List of Accommodations
                  </Text>
                </View>
                <ScrollView overScrollMode="never" bounces={false}>
                  {tripData ? (
                    Object.entries(
                      Array.from(tripData.accommodation.values())
                        .filter((value) => value.name != "")
                        .reduce((counts, accom) => {
                          counts[accom.name] = (counts[accom.name] || 0) + 1;
                          return counts;
                        }, {} as { [name: string]: number })
                    ).map((value, index) => {
                      return (
                        <View
                          key={index + value[0] + value[1] + index}
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
                          <View style={{ flex: 2 }}>
                            <Text style={{ marginLeft: 5 }}>
                              {index + 1}. {value[0]}
                            </Text>
                          </View>
                          <View style={{ flex: 3 }}>
                            <Text>
                              {value[1]} nights @
                              {userData.settings.domesticCurrency}{" "}
                              {getPrice(value[0]).toFixed(2)} / night
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <Text>Error</Text>
                  )}
                </ScrollView>
              </View>
            </View>
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

export default Logistics;
