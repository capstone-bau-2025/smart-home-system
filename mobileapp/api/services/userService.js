import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_URL } from '../../util/auth';
import { store } from '../../store/store';
import { updateLocalToken } from '../../store/slices/userSlice';
import { BASE_URL } from '../../util/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { useEffect } from 'react';
import { setUserId } from '../../store/slices/userSlice';
import { setUserRole } from '../../store/slices/userSlice';


export const fetchUsers = async (hubSerialNumber) => { //fetch users according to the hub SN
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


//fetch users accordin to the hub SN to store the user ID and role in the redux store 
export const findAndStoreUserDetails = async () => {
  const state = store.getState();
  const { email } = state.user;
  // const hubSerialNumber = state.hub.currentHubSerialNumber;
  // const token = state.user.localToken;

  try {
    const users = await fetchUsers('123456789'); 
    const match = users.find((u) => u.email === email);
    if (match) {
      store.dispatch(setUserId(match.id));
      store.dispatch(setUserRole(match.role));
      console.log('User ID stored:', match.id, 'User Role:', match.role);
    }
  } catch (err) {
    console.error('User ID match failed:', err.response?.data || err.message);
  }
};