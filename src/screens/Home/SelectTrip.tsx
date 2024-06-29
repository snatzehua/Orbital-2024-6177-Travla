import React from "react";
import { Text, ScrollView, View } from "react-native";

import BackButton from "../components/BackButton/BackButton";
import SelectionBoxes from "./SelectionBoxes";
import { useUserData } from "../shared/UserDataContext";

interface SelectTripProps {
  setSelectedTrip: React.Dispatch<React.SetStateAction<string>>;
}

const SelectTrip: React.FC<SelectTripProps> = ({ setSelectedTrip }) => {
  const { userData } = useUserData();

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <ScrollView
        style={{ width: "95%" }}
        contentContainerStyle={{
          alignItems: "center",
        }}
      >
        {Array.from(userData.trips.keys()).map((tripName) => (
          <SelectionBoxes
            key={tripName}
            title={tripName}
            dateValue={tripName}
            onPressFunction={setSelectedTrip}
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

export default SelectTrip;
