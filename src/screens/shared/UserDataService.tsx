import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_DATA_KEY = "userData";

export interface UserData {
  trips: Map<string, TripData>;
  settings: Settings;
}

export interface Settings {
  displayEventDetails: boolean;
  displayUpcomingEvents: boolean;
  domesticCurrency: string;
}

const initialSettings = {
  displayEventDetails: true,
  displayUpcomingEvents: true,
  domesticCurrency: "USD",
};

// Create empty UserData
export const createEmptyUserData: () => UserData = () => {
  AsyncStorage.setItem("lastUpdated", new Date().toISOString());
  return {
    trips: new Map<string, TripData>(),
    settings: initialSettings,
  };
};

// Get UserData
export const getUserData = async (): Promise<UserData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!jsonValue) {
      return createEmptyUserData();
    }
    const parsedData = JSON.parse(jsonValue);

    // Convert trips object back into a Map
    const tripsMap = new Map(Object.entries(parsedData.trips));

    // Convert 'days' back to a Map for each TripData
    for (const [tripId, tripData] of tripsMap.entries()) {
      const typedTripData = tripData as TripData;
      typedTripData.start = new Date(typedTripData.start);
      typedTripData.end = new Date(typedTripData.end);
      const daysMap = new Map(
        Object.entries(typedTripData.days).map(
          ([dateStr, events]): [string, any[]] => [
            dateStr,
            events.map((event: any) => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            })),
          ]
        )
      );
      const miscArray = typedTripData.misc.map((misc) => ({
        ...misc,
        cost: { ...misc.cost },
      }));
      const accomsMap = new Map(
        Object.entries(typedTripData.accommodation).map(
          ([dateStr, accommodation]) => [
            dateStr,
            // Assuming `Accommodation` has start/end dates, adjust as needed:
            accommodation,
          ]
        )
      );

      // Update the tripData object in the Map
      tripsMap.set(tripId, {
        ...typedTripData,
        days: daysMap,
        accommodation: accomsMap,
        misc: miscArray,
      });
    }

    const userData: UserData = {
      ...parsedData,
      uid: parsedData.uid || "", // Ensure uid is set
      trips: tripsMap,
    };

    return userData;
  } catch (error) {
    console.error("Error getting user data:", error);
    return createEmptyUserData();
  }
};

// Update UserData
export const updateUserData = async (newUserData: UserData): Promise<void> => {
  try {
    const tripsForJson = Object.fromEntries(
      Array.from(newUserData.trips, ([tripId, tripData]) => {
        // Serialize Days Map within Each Trip
        const daysForJson = Object.fromEntries(
          Array.from(tripData.days, ([dateStr, events]) => [
            dateStr,
            events.map((event) => ({
              ...event,
              start: event.start.toISOString(),
              end: event.end.toISOString(),
            })),
          ])
        );

        // Serialize Accommodation
        const accomsForJson = Object.fromEntries(
          Array.from(tripData.accommodation, ([dateStr, accom]) => [
            dateStr,
            accom,
          ])
        );

        return [
          tripId,
          {
            ...tripData,
            days: daysForJson,
            accommodation: accomsForJson,
            misc: tripData.misc.map((miscItem) => ({
              ...miscItem,
              cost: { ...miscItem.cost }, // Deep copy cost
            })),
          },
        ];
      })
    );

    // Serialize Full UserData
    const jsonData = JSON.stringify(
      {
        ...newUserData,
        trips: tripsForJson, // Replace with the serialized trips
      },
      null,
      2
    ); // Pretty-print with indentation
    await AsyncStorage.setItem(USER_DATA_KEY, jsonData);
    await AsyncStorage.setItem("lastUpdated", new Date().toISOString());
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Clear UserData
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.setItem("lastUpdated", new Date().toISOString());
    console.log("User data cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
