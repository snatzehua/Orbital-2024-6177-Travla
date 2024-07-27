import React, { createContext, useContext, useState, useEffect } from "react";
import { UserData, createEmptyUserData, getUserData } from "../UserDataService";
import { getAuth } from "firebase/auth";
import { fetchExchangeRate } from "../CurrencyDataService";
import { ExchangeRateOffline } from "../data/ExchangeRateOffline";
import { addData, retrieveData, upsertData } from "../SupabaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        let fetchedSupaData = null;
        let supaTimestamp: Date | null = null;
        if (uid) {
          setUid(uid);
          console.log("Set UID to: ", uid);
          const dataSupa = await retrieveData(uid);
          fetchedSupaData = dataSupa?.userData;
          supaTimestamp = dataSupa?.lastUpdated
            ? new Date(dataSupa.lastUpdated)
            : null;
        }
        const fetchedAsyncData = await getUserData(uid);
        const asyncTimestampString = await AsyncStorage.getItem(
          uid + "lastUpdated"
        );
        const asyncTimestamp = asyncTimestampString
          ? new Date(asyncTimestampString)
          : null;
        if (!fetchedSupaData && !fetchedAsyncData) {
          setUserData(createEmptyUserData());
        } else if (fetchedSupaData == null || fetchedSupaData == undefined) {
          setUserData(fetchedAsyncData);
        } else if (fetchedAsyncData == null) {
          setUserData(fetchedSupaData);
        } else {
          if (fetchedSupaData > fetchedAsyncData) {
            setUserData(fetchedSupaData);
          } else {
            setUserData(fetchedAsyncData);
          }
        }
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
    console.log(exchangeRate);
  }, []);

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
