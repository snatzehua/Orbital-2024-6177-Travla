import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const createEvent = async (event) => {
  try {
    const response = await axios.post(`${API_URL}/events`, event);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};