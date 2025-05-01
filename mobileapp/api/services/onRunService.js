import axios from 'axios';
import { BASE_URL, LOCAL_URL } from '../../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../store/slices/userSlice';

// const user = store.getState().user;




export const authenticateUser = async (email, cloudToken) => {
  try {
    if (!email || !cloudToken) {
      throw new Error('Missing email or cloud token.');
    }

    const response = await axios.post(`${LOCAL_URL}api/auth/authenticate`, {
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