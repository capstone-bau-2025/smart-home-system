import axios from 'axios';
import { LOCAL_URL } from '../../util/auth';
import { store } from '../../store/store';
import { updateLocalToken } from '../../store/slices/userSlice';

export const registerWithInvitation = async () => {
  const state = store.getState();

  const invitation = state.hub.adminInvitationCode;
  const hubSerialNumber = state.hub.currentHubSerialNumber;
  const email = state.user.email;
  const cloudToken = state.user.cloudToken;

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
