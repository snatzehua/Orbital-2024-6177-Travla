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
export const formatDate = (startDate: Date, endDate: Date) => {
  if (startDate.getTime() === endDate.getTime()) {
    return `${startDate.toISOString().split("T")[0]}`;
  }
  return `${startDate.toISOString().split("T")[0]} - ${
    endDate.toISOString().split("T")[0]
  }`;
};

// Convert 24h format to 12h format
export const formatTime = (startDate: Date, endDate?: Date) => {
  const formatTimeString = (date: Date) => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString(); // Convert to 12-hour format
    return `${formattedHours}:${minutes} ${period}`;
  };

  const startTimeString = formatTimeString(startDate);

  if (!endDate || startDate.getTime() === endDate.getTime()) {
    return startTimeString;
  }

  const endTimeString = formatTimeString(endDate);
  return `${startTimeString} - ${endTimeString}`;
};

export const getEmptyDaysArray = (startDate: Date, endDate: Date): string[] => {
  const days = [];
  const currentDate = new Date(startDate); // Start with the start date

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    days.push(dateKey);
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  console.log(days);
  return days;
};

export const getEmptyDaysMap = (
  startDate: Date,
  endDate: Date
): Map<string, EventData[]> => {
  const days = new Map<string, EventData[]>();
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    days.set(dateKey, []);
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  console.log(days);
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
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

export const convertToEndDate = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59
    )
  );
};

export const isWithinDateRange = (date: Date, start: Date, end: Date) => {
  // console.log(date);
  // console.log(start);
  // console.log(end);
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

export const getTimezoneOffset = () => {
  const currentTimeZoneOffsetInMinutes = new Date().getTimezoneOffset();
  return currentTimeZoneOffsetInMinutes * 60 * 1000;
};

export const getUTCTime = () => {
  return new Date(new Date().getTime() - getTimezoneOffset());
};

// Styles
const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: { fontFamily: "Arimo-Bold", color: "white" },
});
