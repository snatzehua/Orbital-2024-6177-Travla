import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EventBody from "./EventBody";
import TripBody from "./TripBody";
import { EventData, TripData } from ".";

import { useUserData } from "../../shared/UserDataContext";
import { updateUserData } from "../../shared/UserDataService";
import EditBanner from "./EditBanner";
import { formatDate, formatTime } from "../../shared/DateTimeContext";

type BannerData = {
  data: TripData | EventData;
};

const Banner: React.FC<BannerData> = (datapack: BannerData) => {
  // Extract data from wrapped datapck
  const data = datapack.data;
  const { setUserData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);

  const isTripData = (data: TripData | EventData): data is TripData =>
    data.datatype === "Trip";

  const isEventData = (data: TripData | EventData): data is EventData =>
    data.datatype === "Event";

  // Defining button press functions
  const handleBannerEdit = () => {
    setIsEditing(true); // Show the EditBanner modal
  };
  const handleUpdate = (
    oldTitle: string,
    updatedData: TripData | EventData
  ) => {
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
      if (isTripData(data)) {
        trips.set(data.trip, updatedData);
      } else if (isEventData(data)) {
        const trip = trips.get(data.trip);
        if (trip) {
          const days = new Map(trip.days);
          const day = days?.get(data.day) || [];
          const updatedEvents =
            day?.map((event) =>
              event.title == oldTitle ? updatedData : event
            ) || [];
          days.set(data.day, updatedEvents);
          trips.set(data.trip, { ...trip, days: days });
        }
      }
      const updatedTrips = { ...prevUserData, trips: trips };
      updateUserData(updatedTrips);
      return updatedTrips;
    });
    setIsEditing(false); // Close the modal after saving
  };
  const handleDelete = () => {
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
      if (isTripData(data)) {
        trips.delete(data.trip);
      } else if (isEventData(data)) {
        const trip = trips.get(data.trip);
        if (trip) {
          const days = new Map(trip.days);
          const day = days?.get(data.day) || [];
          const updatedEvents = day?.filter(
            (event) => event.title !== data.title
          );
          days?.set(data.day, updatedEvents);
          trips?.set(data.trip, { ...trip, days: days });
        }
      }
      const updatedUserData = { ...prevUserData, trips: trips };
      updateUserData(updatedUserData);
      return updatedUserData;
    });
    setIsEditing(false); // Close the modal after saving};
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleBannerEdit}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={{ alignItems: "flex-end" }}>
          {data.datatype === "Event" ? (
            <>
              <View style={{ width: "100%" }}>
                <EventBody data={data} />
              </View>
              <Text style={styles.bottom_right}>
                {formatTime(data.start, data.end)}
              </Text>
            </>
          ) : null}
          {data.datatype === "Trip" ? (
            <>
              <View style={{ width: "100%" }}>
                <TripBody data={data} />
              </View>
              <Text style={styles.bottom_right}>
                {formatDate(data.start, data.end)}
              </Text>
            </>
          ) : null}
        </View>
      </TouchableOpacity>
      {isEditing && (
        <EditBanner
          bannerData={data}
          isVisible={isEditing}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  title: {
    fontFamily: "Arimo-Bold",
    fontSize: 18,
    marginBottom: 1,
  },
  bottom_right: {
    fontFamily: "Arimo-Regular",
    fontSize: 12,
  },
});

export default Banner;
