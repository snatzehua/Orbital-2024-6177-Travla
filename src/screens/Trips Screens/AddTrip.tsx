import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import DateTimeDropdown from "../components/DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../components/ErrorDisplay/ErrorDisplay";
import SelectTrip from "../Home/SelectTrip";
import { convertToDate } from "../shared/DateTimeContext";

interface AddTripProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (newTrip: TripData) => void;
}

// Add Trip popup form
const AddTrip = ({ toggleModal, updateAsync }: AddTripProps) => {
  // Defining hooks
  const baseStart = convertToDate(new Date());
  const baseEnd = convertToDate(new Date());

  // Data
  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newTripTitle, setnewTripTitle] = useState("");
  const [newStart, setNewStart] = useState(baseStart);
  const [newEnd, setNewEnd] = useState(baseEnd);

  // Create DayData array
  function getEmptyDaysMap(
    startDate: Date,
    endDate: Date
  ): Map<string, EventData[]> {
    const days = new Map<string, EventData[]>();
    const currentDate = new Date(startDate); // Start with the start date

    while (currentDate <= endDate) {
      const dateKey = currentDate.toLocaleDateString(); // YYYY-MM-DD
      days.set(dateKey, []);
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return days;
  }

  // Defining button press functions (Add Trip)
  const handleAddTrip = () => {
    // Error handling
    if (newTripTitle === "") {
      setError("Please enter a title");
      return;
    }
    if (newStart > newEnd) {
      setError("End cannot be before start");
      return;
    }
    const newTrip: TripData = {
      trip: newTripTitle,
      title: newTripTitle,
      datatype: "Trip",
      start: newStart,
      end: newEnd,
      days: getEmptyDaysMap(newStart, newEnd),
    };
    updateAsync(newTrip);
    toggleModal();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#EBEBEB" }}>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          minHeight: backButtonHeight,
        }}
      >
        <View
          style={{ position: "absolute", left: 0 }}
          onLayout={(Trip) => {
            setBackButtonHeight(Trip.nativeEvent.layout.height);
          }}
        >
          <BackButton onPress={toggleModal} iconName="window-close-o" />
        </View>
        <View style={{ justifyContent: "center" }}>
          <ErrorDisplay error={error} />
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <CustomInput
          value={newTripTitle}
          setValue={setnewTripTitle}
          placeholder="Trip Title"
          secureTextEntry={false}
        />
        <View style={styles.line} />
        <View style={styles.time_dropdown}>
          <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>
            Start :
          </Text>
          <DateTimeDropdown
            datatype={"Trip"}
            date={newStart}
            setDate={setNewStart}
          />
        </View>
        <Text style={styles.to}> - </Text>
        <View style={styles.time_dropdown}>
          <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>End :</Text>
          <DateTimeDropdown
            datatype={"Trip"}
            date={newEnd}
            setDate={setNewEnd}
          />
        </View>
        <View style={styles.line} />
        <CustomButton
          text="Add Trip"
          onPress={handleAddTrip}
          containerStyle={styles.add_trip_container}
          textStyle={styles.add_trip_text}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  line: {
    width: "80%",
    height: 1,
    backgroundColor: "#7D7D7D",
    marginVertical: 10,
  },
  time_dropdown: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  to: { marginVertical: 5 },
  add_trip_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
    marginBottom: "5%",
  },
  add_trip_text: {
    fontFamily: "Arimo-Bold",
  },
});

export default AddTrip;
