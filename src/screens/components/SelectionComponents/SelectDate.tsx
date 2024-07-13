import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";

import SelectionBoxes from "./SelectionBoxes";
import { useUserData } from "../../shared/contexts/UserDataContext";

interface SelectDateProps {
  selectedTrip: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const SelectDate: React.FC<SelectDateProps> = ({
  selectedTrip,
  setSelectedDate,
}) => {
  const { userData } = useUserData();
  const tripData = userData.trips.get(selectedTrip);
  const [dates, setDates] = useState<string[]>([]);
  useEffect(() => {
    if (tripData) {
      setDates(Array.from(tripData.days.keys()));
    }
  }, [tripData]);

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#EBEBEB" }}>
      <Text
        style={{
          fontFamily: "Arimo-Bold",
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        Select Date to Add Event
      </Text>
      <View
        style={{
          width: "90%",
          height: 1,
          backgroundColor: "black",
          marginBottom: 10,
        }}
      />
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
        }}
        overScrollMode="never"
        bounces={false}
      >
        {dates.map((date, index) => (
          <SelectionBoxes
            key={date}
            title={date.split("T")[0]}
            dateValue={date}
            onPressFunction={setSelectedDate}
            index={index + 1}
            maxIndex={dates.length}
          />
        ))}
        {Array.from(userData.trips.keys()).length === 0 ? (
          <>
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                color: "#7D7D7D",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              ...
            </Text>
            <Text style={styles.text}>No dates detected</Text>
          </>
        ) : (
          <Text style={styles.text}>Change trip dates in the 'Trips' tab</Text>
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
    marginTop: "5%",
    marginBottom: "10%",
  },
});

export default SelectDate;
