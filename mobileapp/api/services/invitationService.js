import axios from 'axios';
import { LOCAL_URL } from '../../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const generateInviteCode = async (roleId) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Assuming you have a way to get the token
    const response = await axios.post(`${LOCAL_URL}api/invitations?roleId=${roleId}`, null, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Invitation code generated:', response.data);
    return response.data; 

  } catch (error) {
    console.error('Failed to generate invite code:', error.response?.data || error.message);
    throw error;
  }
};
