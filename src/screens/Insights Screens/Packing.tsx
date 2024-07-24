import React, { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BackButton from "../components/BackButton/BackButton";
import CommonStyles from "../shared/CommonStyles";
import { useUserData } from "../shared/contexts/UserDataContext";

interface PackingProps {
  trip: string;
  togglePacking: () => Promise<void>;
}

const Packing: React.FC<PackingProps> = ({ trip, togglePacking }) => {
  const { userData } = useUserData();
  const tripData = userData.trips.get(trip);

  return (
    <ImageBackground
      source={require("../../../assets/images/packing_background.png")}
      style={styles.page_background}
    >
      <View style={{ zIndex: 1, marginTop: "15%", position: "absolute" }}>
        <BackButton onPress={togglePacking} iconName="window-close-o" />
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
          <Text style={styles.title_text}>Packing</Text>
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
                    Packing List
                  </Text>
                </View>
                <ScrollView overScrollMode="never" bounces={false}>
                  {tripData ? (
                    Array.from(tripData.days.values())
                      .flat()
                      .filter((value) => value.items.length > 0).length > 0 ? (
                      Array.from(tripData.days.values())
                        .flat()
                        .filter((value) => value.items.length > 0)
                        .reduce(
                          (merged: string[], event: EventData) => [
                            ...new Set([...merged, ...event.items]),
                          ],
                          []
                        )
                        .map((value, index) => {
                          return (
                            <View
                              key={index + value}
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
                              <Text>
                                {index + 1}. {value}
                              </Text>
                            </View>
                          );
                        })
                    ) : (
                      <Text style={{ margin: 5 }}>No items found</Text>
                    )
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

export default Packing;
