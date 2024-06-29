import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import DateTimeDropdown from "../components/DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../components/ErrorDisplay/ErrorDisplay";
import SelectTrip from "./SelectTrip";
import SelectDate from "./SelectDate";
import { useUserData } from "../shared/UserDataContext";
import { updateUserData } from "../shared/UserDataService";
import { convertToDate } from "../shared/DateTimeContext";

interface AddEventProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  updateAsync: (
    selectedTrip: string,
    selectedDate: string,
    newEvent: EventData
  ) => Promise<void>;
}

// Add event popup form
const AddEvent = ({ toggleModal, updateAsync }: AddEventProps) => {
  // Defining hooks
  const baseStart = convertToDate(new Date());
  const baseEnd = convertToDate(new Date());

  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newStart, setNewStart] = useState(baseStart);
  const [newEnd, setNewEnd] = useState(baseEnd);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // Defining button press functions (Add Event)
  const handleAddEvent = async () => {
    // Error handling
    if (newEventTitle === "") {
      setError("Please enter a title");
      return;
    }
    if (newStart.getTime > newEnd.getTime) {
      setError("End cannot be before start");
      return;
    }
    const newEvent: EventData = {
      title: newEventTitle,
      datatype: "Event",
      start: newStart,
      end: newEnd,
    };
    updateAsync(selectedTrip, selectedDate, newEvent);
    toggleModal();
  };
  const handleDateBackButton = () => {
    setSelectedTrip("");
  };

  const handleAddBackButton = () => {
    setSelectedDate("");
  };

  return (
    <SafeAreaView style={{ height: "85%", backgroundColor: "#EBEBEB" }}>
      {selectedTrip === "" ? (
        <>
          <View style={{ alignItems: "flex-start" }}>
            <BackButton onPress={toggleModal} iconName="window-close-o" />
          </View>
          <SelectTrip setSelectedTrip={setSelectedTrip} />
        </>
      ) : selectedDate === "" ? (
        <>
          <View style={{ alignItems: "flex-start" }}>
            <BackButton onPress={handleDateBackButton} />
          </View>
          <SelectDate
            selectedTrip={selectedTrip}
            setSelectedDate={setSelectedDate}
          />
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <View>
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                minHeight: backButtonHeight,
              }}
            >
              <View
                style={{ position: "absolute", left: 0 }}
                onLayout={(event) => {
                  setBackButtonHeight(event.nativeEvent.layout.height);
                }}
              >
                <BackButton onPress={handleAddBackButton} />
              </View>
              <View style={{ justifyContent: "center" }}>
                <ErrorDisplay error={error} />
              </View>
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            style={{
              flex: 1,
            }}
          >
            <CustomInput
              value={newEventTitle}
              setValue={setNewEventTitle}
              placeholder="Event Title"
              secureTextEntry={false}
            />
            <View style={styles.line} />
            <View style={styles.time_dropdown}>
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>
                Start :
              </Text>
              <DateTimeDropdown
                datatype={"Event"}
                date={newStart}
                setDate={setNewStart}
              />
            </View>
            <Text style={styles.to}> - </Text>
            <View style={styles.time_dropdown}>
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>
                End :
              </Text>
              <DateTimeDropdown
                datatype={"Event"}
                date={newEnd}
                setDate={setNewEnd}
              />
            </View>
            <View style={styles.line} />
          </ScrollView>
          <CustomButton
            text="Add Event"
            onPress={handleAddEvent}
            containerStyle={styles.add_event_container}
            textStyle={styles.add_event_text}
          />
        </View>
      )}
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
  add_event_container: {
    backgroundColor: "#FFB000",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 10,
    marginTop: 5,
    marginBottom: "5%",
  },
  add_event_text: {
    fontFamily: "Arimo-Bold",
  },
});

export default AddEvent;
