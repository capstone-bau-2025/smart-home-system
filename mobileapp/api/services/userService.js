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
      params: {hubSerialNumber},
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    console.log('Users from /users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users for hub:', error.response?.data || error.message);
    throw error;
  }
};


// export const fetchAllUsers = async (hubSerialNumber) => { 
//   try {
//     const token = await AsyncStorage.getItem('userToken');
//     const response = await axios.get(`${BASE_URL}api/users/user-details`, {
//       params: { hubSerialNumber },
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: 'application/json',
//       },
//     });

//     console.log('Users:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching users for hub:', error.response?.data || error.message);
//     throw error;
//   }
// };

//fetch users accordin to the hub SN to store the user ID and role in the redux store 
export const findAndStoreUserDetails = async (hubSerialNumber) => {
  const state = store.getState();
  const { email } = state.user;
  // const hubSerialNumber = state.hub.currentHubSerialNumber;
  // const token = state.user.localToken;

  try {
    const users = await fetchUsers(hubSerialNumber); 
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


export const fetchUserDetails = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await axios.get(`${BASE_URL}api/users/user-details`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });


    return res.data;
  } catch (err) {
    console.error('User details fetch failed:', err.response?.data || err.message);
    throw err;
  }
};


export const userPermsissions = async (userId, hubSerialNumber) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const res = await axios.get(`${BASE_URL}api/users/${userId}/permissions`, {
      params: {hubSerialNumber },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("User Permissions:", res.data);
    return res.data;
  } catch (err) {
    console.error('User permissions fetch failed:', err.response?.data || err.message);
    throw err;
  }


}
export const updateUserPermissions = async (targetUserId, roomIds, hubSerialNumber) => {
  const state = store.getState();
  const token = state.user.localToken;

  const payload = {
    targetUserId,
    roomIds
  };

  try {
    const res = await axios.post(`${BASE_URL}api/users/update-permissions`, payload, {
      headers:
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        
      },
      params: { hubSerialNumber },
    });

    console.log('Permissions updated successfully');
    return res.data;
  } catch (err) {
    console.error('Failed to update permissions:', err.response?.data || err.message);
    throw err;
  }
};


export const deleteUser = async (userId, hubSerialNumber) => {
  const state = store.getState();
  const token = state.user.localToken;

  try {
    const res = await axios.delete(`${BASE_URL}api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      params: { hubSerialNumber },
    });

    console.log('User deleted successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error deleting user:', err);
    throw err;
  }
};