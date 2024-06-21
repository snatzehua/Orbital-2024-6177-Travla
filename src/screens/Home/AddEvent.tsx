import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import BackButton from "../components/BackButton/BackButton";
import CustomButton from "../components/CustomButtom/CustomButton";
import CustomInput from "../components/CustomInput/CustomInput";
import DateTimeDropdown from "../components/DateTimeDropdown";

interface AddEventProps {
  toggleModal: () => void; // Function that takes no arguments and returns void
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>; // Dispatch function for updating the events array
}

// Add event popup form
const AddEvent = ({ toggleModal, setEvents }: AddEventProps) => {
  // Defining hooks
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newStart, setNewStart] = useState(new Date());

  // Defining button press functions (Add Event)
  const handleAddEvent = () => {
    // Error handling
    if (newEventTitle === "") {
      return;
    }
    const newEvent: EventData = {
      title: newEventTitle,
      // placeholders
      datatype: "Event",
      start: new Date(),
      end: new Date(),
    };
    setEvents((list) => [...list, newEvent]);
    toggleModal();
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#EBEBEB" }}>
      <View style={{ alignItems: "flex-start" }}>
        <BackButton onPress={toggleModal} iconName="window-close-o" />
      </View>
      <View style={{ alignItems: "center" }}>
        <CustomInput
          value={newEventTitle}
          setValue={setNewEventTitle}
          placeholder="Event Title"
          secureTextEntry={false}
        />
        <View style={{ flexDirection: "row", width: "90%" }}>
          <DateTimeDropdown datatype={"Event"} />
        </View>
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
