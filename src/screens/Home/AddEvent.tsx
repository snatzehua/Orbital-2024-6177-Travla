import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import DateTimeDropdown from "../components/DateTimeDropdown/DateTimeDropdown";
import ErrorDisplay from "../components/ErrorDisplay/ErrorDisplay";

interface AddEventProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>; // Dispatch function for updating the events array
}

// Add event popup form
const AddEvent = ({ toggleModal, setEvents }: AddEventProps) => {
  // Defining hooks
  const baseStart = new Date();
  baseStart.setHours(0);
  baseStart.setMinutes(0);
  baseStart.setSeconds(0);
  const baseEnd = new Date();
  baseEnd.setHours(0);
  baseEnd.setMinutes(0);
  baseEnd.setSeconds(0);
  const [backButtonHeight, setBackButtonHeight] = useState(0);
  const [error, setError] = useState("");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newStart, setNewStart] = useState(baseStart);
  const [newEnd, setNewEnd] = useState(baseEnd);

  // Defining button press functions (Add Event)
  const handleAddEvent = () => {
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
    setEvents((list) => [...list, newEvent]);
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
          onLayout={(event) => {
            setBackButtonHeight(event.nativeEvent.layout.height);
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
          <Text style={{ fontFamily: "Arimo-Bold", fontSize: 20 }}>End :</Text>
          <DateTimeDropdown
            datatype={"Event"}
            date={newEnd}
            setDate={setNewEnd}
          />
        </View>
        <View style={styles.line} />
        <CustomButton
          text="Add Event"
          onPress={handleAddEvent}
          containerStyle={styles.add_event_container}
          textStyle={styles.add_event_text}
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
