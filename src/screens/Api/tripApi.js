import axios from 'axios';

const API_URL = 'https://travla-server.onrender.com/api';

// Create a new trip
export const createTrip = async (tripData) => {
  try {
    const response = await axios.post(`${API_URL}/trips`, tripData);
    return response.data;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

// Get trip by ID
export const fetchTrip = async (tripId) => {
  try {
    const response = await axios.get(`${API_URL}/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    throw error;
  }
};

// Update trip by ID
export const updateTrip = async (tripId, newTripData) => {
  try {
      const response = await axios.put(`${API_URL}/trips/${tripId}`, newTripData);
    return response.data;
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

// Delete trip by ID
export const deleteTrip = async (tripId) => {
  try {
    const response = await axios.delete(`${API_URL}/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};