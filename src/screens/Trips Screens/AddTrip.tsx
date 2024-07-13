import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { getAuth } from "firebase/auth";
import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import DateTimeDropdown from "../components/DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../components/ErrorDisplay/ErrorDisplay";
import { createTrip } from "../Api/tripApi";
import {
  getEmptyDaysMap,
  getUTCTime,
} from "../shared/contexts/DateTimeContext";
import { convertToStartDate } from "../shared/contexts/DateTimeContext";
import { useUserData } from "../shared/contexts/UserDataContext"; // Import user data context

interface AddTripProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (newTrip: TripData) => void;
}

// Add Trip popup form
const AddTrip = ({ toggleModal, updateAsync }: AddTripProps) => {
  const { userData, uid } = useUserData(); // Access uid from context

  const baseStart = convertToStartDate(getUTCTime());
  const baseEnd = convertToStartDate(getUTCTime());

  //console.log(baseStart);
  // Data
  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newTripTitle, setnewTripTitle] = useState("");
  const [newStart, setNewStart] = useState(baseStart);
  const [newEnd, setNewEnd] = useState(baseEnd);

  useEffect(() => {
    if (newStart > newEnd) {
      setNewEnd(newStart);
    }
  }, [newStart]);

  // Defining button press functions (Add Trip)
  const handleAddTrip = async () => {
    // Error handling
    if (newTripTitle === "") {
      setError("Please enter a title");
      return;
    }
    /*
    if (newStart > newEnd) {
      setError("End cannot be before start");
      return;
    }
    */
    if (!uid) {
      setError("User ID not found");
      return;
    }

    const newTrip: TripData = {
      user: userData._id,
      trip: newTripTitle,
      title: newTripTitle,
      datatype: "Trip",
      start: newStart,
      end: newEnd,
      days: getEmptyDaysMap(newStart, newEnd),
    };
    console.log("TripData: ", newTrip);
    try {
      await createTrip(newTrip); // Call createTrip API
      updateAsync(newTrip);
      toggleModal();
      console.log("Userdata after adding trip: ", userData);
    } catch (error) {
      console.log("failed to add trip");
      setError("Failed to create trip");
    }
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
          onSubmitEditing={handleAddTrip}
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
            minimumDate={newStart}
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
