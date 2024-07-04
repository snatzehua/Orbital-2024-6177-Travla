import axios from 'axios';

// Base URL for API
const BASE_URL = 'http://localhost:3001/api';

// Create a new trip
export const createTrip = async (tripData) => {
  try {
    const response = await axios.post(`${BASE_URL}/trips`, tripData);
    return response.data;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

// Get all trips for a user
export const getTrips = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trips`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
};

// Get trip by ID
export const getTripById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/trips/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    throw error;
  }
};

// Delete trip by ID
export const deleteTripById = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/trips/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};