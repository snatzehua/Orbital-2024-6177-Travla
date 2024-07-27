import React, { useState } from "react";

import BaseInputHandling from "../Base/BaseInputHandling";
import { getLocationGeometry } from "../../../shared/UserDataService";

const EventInputHandling = (
  title: string,
  start: Date,
  end: Date,
  user: string,
  trip: string,
  day: string,
  location: string,
  geometry: { lat: number; lng: number },
  description: string,
  currency: string,
  amount: string,
  items: string[],
  remarks: string,
  tag: string,
  onSuccess: (editedData: EventData) => void
) => {
  function trimMultilineString(text: string): string {
    return text
      .split("\n") // Split the string into lines
      .filter(Boolean) // Remove empty lines (those that become empty after trimming)
      .map((line) => line.trim()) // Trim leading/trailing spaces from each line
      .join("\n"); // Join the lines back into a string
  }

  // Error handling
  try {
    BaseInputHandling(title); // Call the separate title validation function
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
  }

  if (start.getTime() > end.getTime()) {
    return "End cannot be before start";
  }
  if (
    Number(amount) == undefined ||
    Number(amount) == null ||
    Number(amount) < 0
  ) {
    return "Invalid cost amount";
  }
  if (Number(amount) > 0 && currency == "") {
    return "Please select a currency";
  }

  // Trim functions
  const trimmedCost = () => {
    return Number(amount) == 0 || amount == ""
      ? { currency: "", amount: 0 }
      : {
          currency: currency,
          amount: amount == "" ? 0 : Number(amount),
        };
  };

  const newEvent: EventData = {
    title: title.trim(),
    datatype: "Event",
    start: start,
    end: end,
    user: user,
    trip: trip,
    day: day,
    location: location.trim(),
    geometry: geometry,
    description: trimMultilineString(description),
    cost: trimmedCost(),
    items: items.filter((item) => item != ""),
    remarks: remarks,
    tag: tag,
  };
  onSuccess(newEvent);
  return "";
};

export default EventInputHandling;
