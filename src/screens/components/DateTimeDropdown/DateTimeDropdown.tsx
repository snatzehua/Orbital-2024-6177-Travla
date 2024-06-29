import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DateTimeDropdownProps {
  datatype: "Event" | "Trip";
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>; // Dispatch function for updating the events array
  minimumDate?: Date;
}

const DateTimeDropdown: React.FC<DateTimeDropdownProps> = ({
  datatype,
  date,
  setDate,
  minimumDate,
}) => {
  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      console.log(date);
    }
  };

  // If Event type
  if (datatype === "Event") {
    return (
      <View style={styles.container}>
        <DateTimePicker
          value={date}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          style={styles.DateTimePicker}
        />
      </View>
    );
  }
  // If Trip type
  if (datatype === "Trip") {
    return (
      <View style={styles.container}>
        <DateTimePicker
          value={date}
          mode={"date"}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          style={styles.DateTimePicker}
        />
      </View>
    );
  }
  // If undefined
  return (
    <View>
      <Text>Undefined datatype: {datatype} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  DateTimePicker: { justifyContent: "center", alignItems: "center" },
});

export default DateTimeDropdown;
