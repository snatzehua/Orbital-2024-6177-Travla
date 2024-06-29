import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_DATA_KEY = "userData";

export interface UserData {
  trips: Map<string, TripData>;
  settings: {};
}

// Create empty UserData
export const createEmptyUserData: () => UserData = () => ({
  trips: new Map<string, TripData>(),
  settings: {},
});

// Get UserData
export const getUserData = async () => {
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

      // Update the tripData object in the Map
      tripsMap.set(tripId, { ...typedTripData, days: daysMap });
    }

    const userData: UserData = {
      ...parsedData,
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
        // 1a. Serialize Days Map within Each Trip
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

        return [
          tripId,
          {
            ...tripData,
            days: daysForJson,
          },
        ];
      })
    );

    // 2. Serialize Full UserData
    const jsonData = JSON.stringify(
      {
        ...newUserData,
        trips: tripsForJson, // Replace with the serialized trips
      },
      null,
      2
    ); // Pretty-print with indentation
    await AsyncStorage.setItem(USER_DATA_KEY, jsonData);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Clear UserData
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    console.log("User data cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
