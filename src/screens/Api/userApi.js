import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (uid) => {
  try {
    const response = await axios.get(`${API_URL}/users/${uid}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // User not found
    }
    console.error('API Error fetching user by ID:', error);
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    console.log("Api creating user: ", user);
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};