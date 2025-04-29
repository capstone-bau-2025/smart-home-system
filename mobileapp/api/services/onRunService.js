import axios from 'axios';
import { BASE_URL } from '../../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../store/slices/userSlice';

export const fetchUsersForHub = async (hubSerialNumber) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); 

    const response = await axios.get(`${BASE_URL}api/users`, {
      params: { hubSerialNumber },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    console.log('Users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users for hub:', error.response?.data || error.message);
    throw error;
  }
};




export const authenticateUser = async (email, cloudToken) => {
  try {
    if (!email || !cloudToken) {
      throw new Error('Missing email or cloud token.');
    }

    const response = await axios.post(`${BASE_URL}api/auth/authenticate`, {
      email,
      cloudToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Authentication successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw error;
  }
};