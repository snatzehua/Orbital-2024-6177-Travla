import React, { useState } from "react";

import BaseBanner from "../Base/BaseBanner";
import TripBody from "./TripBody";
import TripDetails from "./TripDetails";
import EditBanner from "../Base/EditBanner";
import { TripData } from "..";
import { formatDate } from "../../../shared/contexts/DateTimeContext";
import { useUserData } from "../../../shared/contexts/UserDataContext";
import { updateUserData } from "../../../shared/UserDataService";

type TripBannerProps = {
  data: TripData;
};

const TripBanner: React.FC<TripBannerProps> = ({ data }) => {
  // Extract data from wrapped datapck
  const { setUserData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Defining button press functions
  const handleViewTrip = () => {
    setIsViewing(true);
  };
  const handleBannerEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = (oldTitle: string, updatedData: TripData) => {
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
      trips.set(data.trip, updatedData);
      const updatedTrips = { ...prevUserData, trips: trips };
      updateUserData(updatedTrips);
      return updatedTrips;
    });
    setIsEditing(false); // Close the modal after saving
  };
  const handleDelete = () => {
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
      trips.delete(data.trip);
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
        bannerBody={<TripBody data={data} />}
        onPress={handleViewTrip}
        onLongPress={handleBannerEdit}
        bannerDateTime={formatDate(data.start, data.end)}
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
      {isViewing && (
        <TripDetails
          tripData={data}
          isVisible={isViewing}
          onClose={() => setIsViewing(false)}
        />
      )}
    </>
  );
};

export default TripBanner;
