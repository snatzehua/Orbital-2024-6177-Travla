import { supabase } from "../../../utils/supabase";
import { UserData } from "./UserDataService";

export const retrieveData = async (uid: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from("travla_users")
      .select("UserData") // Select the JSON column containing the user data
      .eq("id", uid) // Filter by the provided uid
      .single(); // Expect only one row for this user

    if (error) {
      console.error("Error retrieving data:", error.message);
      // You can also throw an error or return a specific error object here
      return null; // Indicate that no data was found due to an error
    } else {
      // Parse the JSON data into a UserData object
      const parsedData = JSON.parse(data.UserData);

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
      console.log(userData);

      return userData;
    }
  } catch (error) {
    console.error("Unexpected error while retrieving data:", error);
    return null; // Return null in case of an unexpected error
  }
};

export const addData = async (
  uid: string,
  userData: UserData
): Promise<void> => {
  try {
    const tripsForJson = Object.fromEntries(
      Array.from(userData.trips, ([tripId, tripData]) => {
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
        ...userData,
        trips: tripsForJson, // Replace with the serialized trips
      },
      null,
      2
    ); // Pretty-print with indentation
    const { error } = await supabase
      .from("travla_users")
      .insert([
        { id: uid, UserData: jsonData, lastUpdated: new Date().toISOString() },
      ]);
    if (error) {
      console.error("Error adding data:", error.message);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const upsertData = async (
  uid: string,
  userData: UserData
): Promise<void> => {
  try {
    const tripsForJson = Object.fromEntries(
      Array.from(userData.trips, ([tripId, tripData]) => {
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
        ...userData,
        trips: tripsForJson, // Replace with the serialized trips
      },
      null,
      2
    ); // Pretty-print with indentation
    const { error } = await supabase.from("travla_users").upsert([
      {
        id: uid,
        UserData: jsonData,
        lastUpdated: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error upserting data:", error.message);
    } else {
      console.log("Data upserted successfully");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const deleteData = async (uid: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("travla_users")
      .delete()
      .match({ id: uid });

    if (error) {
      console.error("Error deleting data:", error.message);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};
