import axios from 'axios';
import { LOCAL_URL } from '../../util/auth';
import { store } from '../../store/store';

export const fetchAllInteractions = async () => {
  const localToken = store.getState().user.localToken;

  try {
    const res = await axios.get(`${LOCAL_URL}api/interactions`, {
      headers: {
        Authorization: `Bearer ${localToken}`,
        Accept: 'application/json',
      },
    });

    return res.data; 
  } catch (err) {
    console.error('Error fetching interactions:', err?.response?.data || err.message);
    throw err;
  }
};
