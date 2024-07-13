import React, { useState } from "react";

import BaseBanner from "../Base/BaseBanner";
import EventBody from "./EventBody";
import EditBanner from "../Base/EditBanner";
import Tag from "./Tag";
import { EventData } from "..";
import { formatTime } from "../../../shared/contexts/DateTimeContext";
import { useUserData } from "../../../shared/contexts/UserDataContext";
import { updateUserData } from "../../../shared/UserDataService";

type EventBannerProps = {
  data: EventData;
  displayEventDetails?: boolean;
};

const EventBanner: React.FC<EventBannerProps> = ({
  data,
  displayEventDetails,
}) => {
  const eventBody = displayEventDetails ? <EventBody data={data} /> : null;

  // Extract data from wrapped datapck
  const { setUserData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Defining button press functions
  const handleViewTrip = () => {};
  const handleBannerEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = (oldTitle: string, updatedData: EventData) => {
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
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
      const updatedTrips = { ...prevUserData, trips: trips };
      updateUserData(updatedTrips);
      return updatedTrips;
    });
    setIsEditing(false); // Close the modal after saving
  };
  const handleDelete = () => {
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
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
      const updatedUserData = { ...prevUserData, trips: trips };
      updateUserData(updatedUserData);
      return updatedUserData;
    });
    setIsEditing(false); // Close the modal after saving};
  };

  return (
    <>
      <BaseBanner
        title={data.title}
        bannerBody={eventBody}
        onPress={handleViewTrip}
        onLongPress={handleBannerEdit}
        bannerDateTime={formatTime(data.start, data.end)}
        tag={data.tag}
      />
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

export default EventBanner;
