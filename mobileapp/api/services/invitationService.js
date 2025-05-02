import axios from 'axios';
import { LOCAL_URL } from '../../util/auth';

export const generateInviteCode = async (roleId) => {
  try {
    const response = await axios.post(`${LOCAL_URL}api/invitations?roleId=${roleId}`, null, {
      headers: {
        Accept: '*/*',
        
      },
    });

    console.log('Invitation code generated:', response.data);
    return response.data; 

  } catch (error) {
    console.error('Failed to generate invite code:', error.response?.data || error.message);
    throw error;
  }
};
