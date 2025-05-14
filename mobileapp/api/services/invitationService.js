import axios from 'axios';
import { LOCAL_URL } from '../../util/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../store/store';

export const generateInviteCode = async (roleId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const currentUrl = store.getState().url.currentUrl || LOCAL_URL;
    const endpoint = `${currentUrl}api/invitations?roleId=${roleId}`;

    const response = await axios.post(endpoint, null, {
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
