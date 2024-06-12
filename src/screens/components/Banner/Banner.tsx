import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BannerData } from ".";

const Banner: React.FC<BannerData> = (datapack: BannerData) => {
  // Extract data from wrapped datapck
  const data = datapack.data;

  // Convert 24h format to 12h format
  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = (hour % 12 || 12).toString().padStart(2, "0"); // Convert 0 to 12
    const formattedMinute = minute.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  // Defining button press functions
  const handleBannerEdit = () => {
    console.log("Banner pressed");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleBannerEdit}>
      <Text style={styles.title}>{data.title}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.time}>
          {formatTime(data.startHour, data.startMinute)}
          {" - "}
          {formatTime(data.endHour, data.endMinute)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  title: {
    fontFamily: "Arimo-Bold",
    fontSize: 18,
    marginBottom: 1,
  },
  time: {
    fontFamily: "Arimo-Regular",
    fontSize: 12,
  },
});

export default Banner;
