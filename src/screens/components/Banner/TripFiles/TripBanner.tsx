import React, { useState } from "react";

import BaseBanner from "../Base/BaseBanner";
import TripBody from "./TripBody";
import TripDetails from "./TripDetails";
import EditBanner from "../Base/EditBanner";
import { TripData } from "..";
import { formatDate } from "../../../shared/contexts/DateTimeContext";
import { useUserData } from "../../../shared/contexts/UserDataContext";
import { updateUserData } from "../../../shared/UserDataService";
import { updateTrip, deleteTrip } from "../../../Api/tripApi";

type TripBannerProps = {
  data: TripData;
};

const TripBanner: React.FC<TripBannerProps> = ({ data }) => {
  // Extract data from wrapped datapck
  const { setUserData, userData } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  // Defining button press functions
  const handleViewTrip = () => {
    setIsViewing(true);
  };
  const handleBannerEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (oldTitle: string, updatedData: TripData) => {
    const tripId = data._id;
    console.log("tripid in banner: ", tripId);

    try {
      await updateTrip(tripId, updatedData);
      setUserData((prevUserData) => {
        const trips = new Map(prevUserData.trips);
        if (trips.has(tripId)) {
          trips.set(tripId, updatedData);
        }
        const updatedTrips = { ...prevUserData, trips: trips };
        updateUserData(updatedTrips);
        return updatedTrips;
      });
      setIsEditing(false); // Close the modal after saving
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrip(data._id);
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
    setUserData((prevUserData) => {
      const trips = new Map(prevUserData.trips);
      trips.delete(data._id);
      const updatedUserData = { ...prevUserData, trips: trips };
      updateUserData(updatedUserData);
      return updatedUserData;
    });
    setIsEditing(false); // Close the modal after saving};
    console.log("userdata after deletion: ", userData);
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
