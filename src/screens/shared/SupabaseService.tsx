import { supabase } from "../../../utils/supabase";
import { UserData } from "./UserDataService";

export const retrieveData = async (
  uid: string
): Promise<{ userData: UserData; lastUpdated: string } | undefined> => {
  try {
    const { data, error } = await supabase
      .from("travla_users")
      .select("UserData, lastUpdated")
      .eq("id", uid)
      .single(); // Use .single() to enforce single-row retrieval

    if (error) {
      console.error("Error retrieving data:", error.message);
    } else {
      return {
        userData: data.UserData, // Access directly from the 'data' object
        lastUpdated: data.lastUpdated,
      };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
  return undefined;
};

export const addData = async (
  uid: string,
  userData: UserData
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("travla_users")
      .insert([
        { id: uid, UserData: userData, lastUpdated: new Date().toISOString() },
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
    const { error } = await supabase.from("travla_users").upsert([
      {
        id: uid,
        UserData: userData,
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
