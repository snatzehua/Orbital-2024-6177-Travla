import React, { createContext, useContext, useState, useEffect } from "react";
import { UserData, createEmptyUserData, getUserData } from "../UserDataService";
import { getAuth } from "firebase/auth";
import { fetchExchangeRate } from "../CurrencyDataService";
import { ExchangeRateOffline } from "../data/ExchangeRateOffline";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { retrieveData, retrieveLastUpdated } from "../SupabaseService";

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
  exchangeRate: { [key: string]: any };
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
  userData: createEmptyUserData(),
  setUserData: () => {},
  exchangeRate: {},
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
  const [userData, setUserData] = useState<UserData>(createEmptyUserData());
  const [exchangeRate, setExchangeRate] = useState<{ [key: string]: any }>(
    ExchangeRateOffline
  );
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (uid == null || uid == "") {
          return;
        }
        let fetchedData = null;
        const asyncStringTimestamp = await AsyncStorage.getItem("lastUpdated");
        console.log();
        const supaStringTimestamp = await retrieveLastUpdated(uid);
        const asyncData = await getUserData();
        console.log("Fetched from Async: ", asyncData);
        const supaData = await retrieveData(uid);
        console.log("Fetched from Supa: ", supaData);
        // Both no data
        if (!supaData && !asyncData) {
          console.log("No data found, creating new user data");
        } else if (!supaData) {
          fetchedData = asyncData;
        }
        // Conflict handling - default to local
        else {
          if (!asyncStringTimestamp || !supaStringTimestamp) {
            console.log("Timestamp missing: Grabbing from local");
            fetchedData = asyncData;
          } else {
            const asyncTimestamp = new Date(asyncStringTimestamp);
            const supaTimestamp = new Date(supaStringTimestamp);
            console.log("AsyncTimestamp: ", asyncTimestamp);
            console.log("SupaTimestamp: ", supaTimestamp);
            if (supaTimestamp > asyncTimestamp) {
              console.log("Supa more updated: Grabbing from online");
              fetchedData = supaData;
            } else {
              console.log("Async more updated: Grabbing from local");
              fetchedData = asyncData;
            }
          }
        }
        setUserData(fetchedData ?? createEmptyUserData());
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setIsLoading(false);
      }
    };
    const getExchangeRateObject = async () => {
      try {
        const exchangeRateObject = await fetchExchangeRate();
        setExchangeRate(exchangeRateObject);
      } catch (e) {
        console.error(e);
      }
    };
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
      console.log("User ID from Firebase Auth:", user.uid);
    }

    fetchUserData();
    getExchangeRateObject();
  }, [uid]);

  useEffect(() => {
    console.log("Changed... : ", userData);
  }, [userData]);

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
        exchangeRate,
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
