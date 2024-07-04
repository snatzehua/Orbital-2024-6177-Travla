import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EventBody from "../EventFiles/EventBody";
import TripBody from "../TripFiles/TripBody";
import { EventData, TripData } from "..";

import EditBanner from "../Base/EditBanner";
import TripDetails from "../TripFiles/TripDetails";
import { useUserData } from "../../../shared/UserDataContext";
import { updateUserData } from "../../../shared/UserDataService";
import { formatDate, formatTime } from "../../../shared/DateTimeContext";

type BannerProps = {
  data: EventData | TripData;
  displayEventDetails?: boolean;
};

const Banner: React.FC<BannerProps> = ({
  data,
  displayEventDetails = true,
}) => {
  // Extract data from wrapped datapck
  const { setUserData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const isTripData = (data: TripData | EventData): data is TripData =>
    data.datatype === "Trip";

  const isEventData = (data: TripData | EventData): data is EventData =>
    data.datatype === "Event";

  // Defining button press functions
  const handleViewTrip = () => {
    if (isEventData(data)) {
      setIsEditing(true);
    }
    if (isTripData(data)) {
      setIsViewing(true);
    }
  };
  const handleBannerEdit = () => {
    if (isEventData(data)) {
      setIsEditing(true);
    }
    if (isTripData(data)) {
      setIsEditing(true);
    }
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
      <TouchableOpacity
        style={styles.container}
        onPress={handleViewTrip}
        onLongPress={handleBannerEdit}
        delayLongPress={350}
      >
        <Text style={styles.title}>{data.title}</Text>
        <View style={{ alignItems: "flex-end" }}>
          {isEventData(data) ? (
            <>
              {displayEventDetails ? (
                <View style={{ width: "100%" }}>
                  <EventBody data={data} />
                </View>
              ) : null}
              <Text style={styles.bottom_right}>
                {formatTime(data.start, data.end)}
              </Text>
            </>
          ) : null}
          {isTripData(data) ? (
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
      {isViewing && isTripData(data) && (
        <TripDetails
          tripData={data}
          isVisible={isViewing}
          onClose={() => setIsViewing(false)}
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
