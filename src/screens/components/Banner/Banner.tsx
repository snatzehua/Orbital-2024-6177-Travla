import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { EventData, TripData } from ".";

type BannerData = {
  data: TripData | EventData;
};

const Banner: React.FC<BannerData> = (datapack: BannerData) => {
  // Extract data from wrapped datapck
  const data = datapack.data;

  // Format dates
  const formatDate = (startDate: Date | string, endDate: Date | string) => {
    if (startDate instanceof Date && endDate instanceof Date) {
      // Handle Dates
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    if (typeof startDate === "string" && typeof endDate === "string") {
      // Handle strings (potentially parse them into Dates if needed)
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      return `${parsedStartDate.toLocaleDateString()} - ${parsedEndDate.toLocaleDateString()}`;
    }
    return "Error detected";
  };

  // Convert 24h format to 12h format
  const formatTime = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
    };
    const startTimeString = start.toLocaleTimeString([], options);
    const endTimeString = end.toLocaleTimeString([], options);
    if (startTimeString === endTimeString) {
      return `${startTimeString}`;
    }
    return `${startTimeString} - ${endTimeString}`;
  };

  // Defining button press functions
  const handleBannerEdit = () => {
    console.log("Banner pressed");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleBannerEdit}>
      <Text style={styles.title}>{data.title}</Text>
      <View style={{ alignItems: "flex-end" }}>
        {data.datatype === "Event" ? (
          <Text style={styles.bottom_right}>
            {formatTime(data.start, data.end)}
          </Text>
        ) : null}
        {data.datatype === "Trip" ? (
          <Text style={styles.bottom_right}>
            {formatDate(data.start, data.end)}
          </Text>
        ) : null}
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
  bottom_right: {
    fontFamily: "Arimo-Regular",
    fontSize: 12,
  },
});

export default Banner;
