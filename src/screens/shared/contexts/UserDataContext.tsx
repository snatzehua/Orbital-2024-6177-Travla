import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserById, createUser } from "../../Api/userApi";
import { fetchTrip } from "../../Api/tripApi";

interface UserData {
  _id: string;
  uid: string;
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
  domesticCurrency: "",
};

// 1. Interface for Type Safety (with isLoading)
interface UserDataContextType {
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  userInfo: string;
  setUserInfo: React.Dispatch<React.SetStateAction<string>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  isLoading: boolean;
  error: string | null;
}

// 2. Create Context with Interface
const UserDataContext = createContext<UserDataContextType>({
  uid: "",
  setUid: () => {},
  user: "",
  setUser: () => {},
  userInfo: "",
  setUserInfo: () => {},
  userData: { _id: "", uid: "", trips: new Map<string, TripData>(), settings: initialSettings},
  setUserData: () => {},
  isLoading: true, // Initial loading state is true
  error: null,
});

// 3. Provider Component (with isLoading)
export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [uid, setUid] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<string>("");
  const [userData, setUserData] = useState<UserData>({ _id: "", uid: "", trips: new Map<string, TripData>(), settings: initialSettings });
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null);

  // In the useEffect for fetching user data
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        console.log("Fetching user data for UID within UserDataProvider:", uid);
        try {

          const existingUser = await fetchUserById(uid);
          console.log("Fetched user within UserDataProvider:", existingUser);
          if (existingUser != null) {
            // Fetch each trip by its ObjectId
            const tripFetchPromises = existingUser.trips.map((tripId: string) => fetchTrip(tripId)); // Create promises for fetching each trip by its ID
            const trips = await Promise.all(tripFetchPromises);

            // Convert trips to a map
            const tripsMap = new Map<string, TripData>(
              trips.map(trip => {
                const typedTripData = trip as TripData;
                typedTripData.start = new Date(typedTripData.start);
                typedTripData.end = new Date(typedTripData.end);
                const daysMap = new Map<string, EventData[]>(
                  Object.entries(typedTripData.days).map(
                    ([dateStr, events]): [string, EventData[]] => [
                      dateStr,
                      events.map((event: any) => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end),
                      })),
                    ]
                  )
                );
                return [trip._id, { ...typedTripData, days: daysMap }];
              })
            );
            const userData: UserData = {
              ...existingUser,
              trips: tripsMap,
            };
            setUserData(userData);
            console.log("UserData: ", userData);
          } else {
            const newUser = { uid: uid };
            const createdUser = await createUser(newUser);
            setUserData({ ...createdUser, trips: new Map<string, TripData>() });
            console.log("Created user within UserDataProvider:", createdUser);
          }
        } catch (error) {
          console.error("Error fetching user data within UserDataProvider:", error);
          setError("Error fetching user data");
        }
        setIsLoading(false); // Set loading to false
      }
    };

    fetchUserData();
  }, [uid]);

  useEffect(() => {
    console.log("Verifying UID in component:", uid);
  }, [uid]);

  return (
    <UserDataContext.Provider
      value={{
        userInfo,
        setUserInfo,
        uid,
        setUid,
        user,
        setUser,
        userData,
        setUserData,
        isLoading,
        error,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// 5. Custom Hook (unchanged)
export const useUserData = () => {
  return useContext(UserDataContext);
};
