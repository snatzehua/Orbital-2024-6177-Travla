import React, { createContext, useContext, useState, useEffect } from "react";
import { UserData, createEmptyUserData, getUserData } from "./UserDataService";

// 1. Interface for Type Safety (with isLoading)
interface UserDataContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  isLoading: boolean;
  error: string | null;
}

// 2. Create Context with Interface
const UserDataContext = createContext<UserDataContextType>({
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

    fetchUserData();
  }, []); // Run only once when the component mounts

  // 4. Include isLoading in the Value
  return (
    <UserDataContext.Provider
      value={{ userData, setUserData, isLoading, error }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// 5. Custom Hook (unchanged)
export const useUserData = () => {
  return useContext(UserDataContext);
};
