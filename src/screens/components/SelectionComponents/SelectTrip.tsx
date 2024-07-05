import React from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";

import BackButton from "../BackButton/BackButton";
import SelectionBoxes from "./SelectionBoxes";
import { useUserData } from "../../shared/UserDataContext";

interface SelectTripProps {
  setSelectedTrip: React.Dispatch<React.SetStateAction<string>>;
}

const SelectTrip: React.FC<SelectTripProps> = ({ setSelectedTrip }) => {
  const { userData } = useUserData();
  const currentTrip = Array.from(userData.trips.keys());

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          fontFamily: "Arimo-Bold",
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Select Trip to Add Event
      </Text>
      <View
        style={{
          width: "90%",
          height: 1,
          backgroundColor: "#7D7D7D",
          marginBottom: 10,
        }}
      />
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {currentTrip.map((tripName) => (
          <SelectionBoxes
            key={tripName}
            title={tripName}
            dateValue={tripName}
            onPressFunction={setSelectedTrip}
            startDate={userData.trips.get(tripName)?.start}
            endDate={userData.trips.get(tripName)?.end}
          />
        ))}
        {Array.from(userData.trips.keys()).length === 0 ? (
          <>
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                fontSize: 25,
                color: "#7D7D7D",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              ...
            </Text>
            <Text style={styles.text}>
              No trips, add one in the 'Trips' tabs!
            </Text>
          </>
        ) : (
          <Text style={styles.text}>Add more trips in the 'Trips' tab!</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Arimo-Bold",
    color: "#7D7D7D",
    justifyContent: "center",
    marginVertical: "5%",
  },
});

export default SelectTrip;
