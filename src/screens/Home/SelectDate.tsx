import React, { useEffect, useState } from "react";
import { Text, ScrollView, View } from "react-native";

import SelectionBoxes from "./SelectionBoxes";
import { useUserData } from "../shared/UserDataContext";

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
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        style={{ width: "95%" }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {dates.map((date) => (
          <SelectionBoxes
            key={date}
            title={date.split("T")[0]}
            dateValue={date}
            onPressFunction={setSelectedDate}
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
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                color: "#7D7D7D",
                justifyContent: "center",
              }}
            >
              No trips, add one in the 'Trips' tabs!
            </Text>
          </>
        ) : (
          <Text style={{ fontFamily: "Arimo-Bold", color: "#7D7D7D" }}>
            Add more trips in the 'Trips' tab!
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SelectDate;
