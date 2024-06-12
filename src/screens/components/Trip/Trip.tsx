import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TripData } from ".";

const Trip: React.FC<TripData> = (datapack: TripData) => {
  // Extract data from wrapped datapck
  const data = datapack.data;

  // Format dates
  const startDateString = data.startDate.toLocaleDateString();
  const endDateString = data.endDate.toLocaleDateString();

  // Defining button press functions
  const handleTripEdit = () => {
    console.log("Trip pressed");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleTripEdit}>
      <Text style={styles.title}>{data.title}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.date}>
          {startDateString} - {endDateString}
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
  date: {
    fontFamily: "Arimo-Regular",
    fontSize: 12,
  },
});

export default Trip;
