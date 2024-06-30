import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { fetchTripsByUser } from '../services/api';
import { useUserData } from '../context/UserDataContext';

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const { userData } = useUserData();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userTrips = await fetchTripsByUser(userData.uid);
        setTrips(userTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    if (userData.uid) {
      fetchTrips();
    }
  }, [userData.uid]);

  return (
    <View>
      <FlatList
        data={trips}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{new Date(item.startDate).toDateString()} - {new Date(item.endDate).toDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TripsList;