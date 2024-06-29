import React, { createContext, useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useUserData } from "./UserDataContext";

// 1. DateTimeContext
const DateTimeContext = createContext<{
  date: Date;
}>({ date: new Date() });

// 2. DateTimeProvider
export const DateTimeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userData } = useUserData();
  const [date, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DateTimeContext.Provider value={{ date }}>
      {children}
    </DateTimeContext.Provider>
  );
};

// 3. DateTimeDisplay Component (Now Within the Context)
export const DateTimeDisplay = () => {
  const { date } = useContext(DateTimeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {date.toLocaleDateString()} - {date.toLocaleTimeString()}
      </Text>
    </View>
  );
};

export const convertToDate = (date: Date) => {
  const newDate = date;
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const isWithinDateRange = (start: Date, end: Date) => {
  const { date } = useContext(DateTimeContext);

  return date >= start && date <= end;
};

export const useDate = () => {
  return useContext(DateTimeContext);
};

// Styles
const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: { fontFamily: "Arimo-Bold", color: "white" },
});
