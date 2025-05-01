import axios from 'axios';
import { BASE_URL, LOCAL_URL } from '../../util/auth';
import { store } from '../../store/store';
import { updateLocalToken } from '../../store/slices/userSlice';



export const registerWithInvitation = async ({ invitation, email, cloudToken, hubSerialNumber }) => {
  try {
    const response = await axios.post(`${LOCAL_URL}api/auth/register`, {
      invitation,
      email,
      cloudToken,
      hubSerialNumber,
    });

    store.dispatch(updateLocalToken({ localToken: response.data.token }));

    console.log('Registered with invitation. Local token:', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error in behind-the-scenes registration:', error.response?.data || error.message);
    throw error;
  }
};