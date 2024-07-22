import axios from 'axios';
const API_URL = 'http://localhost:3001/api'; // Adjust according to your setup

export const createEvent = async (event) => {
  try {
    const response = await axios.post(`${API_URL}/events`, event);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};