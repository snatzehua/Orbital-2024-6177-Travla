import React, { createContext, useContext, useState, useEffect } from "react";
import { UserData, createEmptyUserData, getUserData } from "./UserDataService";
import { getAuth } from "firebase/auth";


// 1. Interface for Type Safety (with isLoading)
interface UserDataContextType {
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<any>>;
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
  userData: createEmptyUserData(),
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
  const [userData, setUserData] = useState<UserData>(createEmptyUserData());
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedData = await getUserData();
        setUserData(fetchedData ?? createEmptyUserData());
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
      console.log("User ID from Firebase Auth:", user.uid);
    }

    fetchUserData();
  }, []); // Run only once when the component mounts

  // 4. Include isLoading in the Value
  return (
    <UserDataContext.Provider
      value={{ uid, setUid, user, setUser, userData, setUserData, isLoading, error }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// 5. Custom Hook (unchanged)
export const useUserData = () => {
  return useContext(UserDataContext);
};
