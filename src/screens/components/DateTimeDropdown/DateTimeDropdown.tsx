import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import {
  convertToStartDate,
  getTimezoneOffset,
  getUTCTime,
} from "../../shared/contexts/DateTimeContext";

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
  const [displayDate, setDisplayDate] = useState(
    new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
  );

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(new Date(selectedDate.getTime() - getTimezoneOffset()));
      setDisplayDate(selectedDate);
    }
  };

  // If Event type
  if (datatype === "Event") {
    return (
      <View style={styles.container}>
        <DateTimePicker
          value={displayDate}
          mode={"time"}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={
            minimumDate
              ? new Date(minimumDate?.getTime() + getTimezoneOffset())
              : undefined
          }
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
          value={displayDate}
          mode={"date"}
          display="default"
          onChange={onChange}
          minimumDate={
            minimumDate
              ? new Date(minimumDate?.getTime() + getTimezoneOffset())
              : undefined
          }
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
