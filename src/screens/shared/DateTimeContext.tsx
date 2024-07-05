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

// Format dates
export const formatDate = (
  startDate: Date | string,
  endDate: Date | string
) => {
  if (startDate instanceof Date && endDate instanceof Date) {
    // Handle Dates
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  }
  if (typeof startDate === "string" && typeof endDate === "string") {
    // Handle strings (potentially parse them into Dates if needed)
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    return `${parsedStartDate.toLocaleDateString()} - ${parsedEndDate.toLocaleDateString()}`;
  }
  return "Error detected";
};

// Convert 24h format to 12h format
export const formatTime = (start: Date, end: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  const startTimeString = start.toLocaleTimeString([], options);
  const endTimeString = end.toLocaleTimeString([], options);
  if (startTimeString === endTimeString) {
    return `${startTimeString}`;
  }
  return `${startTimeString} - ${endTimeString}`;
};

export const getEmptyDaysArray = (startDate: Date, endDate: Date): string[] => {
  const days = [];
  const currentDate = new Date(startDate); // Start with the start date

  while (currentDate <= endDate) {
    const dateKey = currentDate.toLocaleDateString(); // YYYY-MM-DD
    days.push(dateKey);
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return days;
};

export const getEmptyDaysMap = (
  startDate: Date,
  endDate: Date
): Map<string, EventData[]> => {
  const days = new Map<string, EventData[]>();
  const currentDate = new Date(startDate); // Start with the start date

  while (currentDate <= endDate) {
    const dateKey = currentDate.toLocaleDateString(); // YYYY-MM-DD
    days.set(dateKey, []);
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return days;
};

export const updateTripDates = (
  dates: Map<string, EventData[]>,
  newStart: Date,
  newEnd: Date
) => {
  const dateKeys = getEmptyDaysArray(newStart, newEnd);
  for (const existingKey of dates.keys()) {
    if (!dateKeys.includes(existingKey)) {
      dates.delete(existingKey);
    }
  }

  // Add new keys (if not already present)
  for (const dateKey of dateKeys) {
    if (!dates.has(dateKey)) {
      dates.set(dateKey, []); // Add with empty array
    }
  }
};

export const convertToStartDate = (date: Date) => {
  const newDate = date;
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const convertToEndDate = (date: Date) => {
  const newDate = date;
  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
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

export const sortEventsByTime = (events: EventData[]) => {
  return events.sort((event1, event2) => {
    const startTime1 = event1.start.getTime();
    const startTime2 = event2.start.getTime();
    if (startTime1 == startTime2) {
      return event1.end.getTime() - event2.end.getTime();
    }
    return startTime1 - startTime2;
  });
};

export const sortTripsByDate = (events: TripData[]) => {
  return events.sort((trip1, trip2) => {
    const startTime1 = trip1.start.getTime();
    const startTime2 = trip2.start.getTime();
    if (startTime1 == startTime2) {
      return trip1.end.getTime() - trip2.end.getTime();
    }
    return startTime1 - startTime2;
  });
};

export const hasConflictingDates = (
  list: BannerData[],
  newStart: Date,
  newEnd: Date
) => {
  for (const item of list) {
    const start = item.start;
    const end = item.end;
    if (
      newEnd.getTime() < start.getTime() ||
      newStart.getTime() > end.getTime()
    ) {
      return false;
    }
    return true;
  }
};

// Styles
const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: { fontFamily: "Arimo-Bold", color: "white" },
});
