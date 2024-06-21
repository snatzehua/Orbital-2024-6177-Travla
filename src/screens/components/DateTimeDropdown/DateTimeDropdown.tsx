import React, { useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DateTimeDropdownProps {
  datatype: "Event" | "Trip";
}

const DateTimeDropdown: React.FC<DateTimeDropdownProps> = ({ datatype }) => {
  const [date, setDate] = useState(new Date());

  const mode = datatype == "Event" ? "time" : "date";

  const onChange = (_event: any, selectedDate?: Date) => {
    console.log("Procced");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <DateTimePicker
      value={date}
      mode={mode}
      is24Hour={true}
      display="default"
      onChange={onChange}
      style={styles.dropdown}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    backgroundColor: "pink",
  },
});

export default DateTimeDropdown;
