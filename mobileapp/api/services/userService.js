import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../util/auth';
import { store } from '../../store/store';
import { setUser, setUserId, setUserRole } from '../../store/slices/userSlice';
import getCurrentUrl from '../../util/helperUrl';

export const fetchUsers = async (hubSerialNumber) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const currentUrl = getCurrentUrl();

    const response = await axios.get(`${currentUrl}api/users`, {
      params: { hubSerialNumber },
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

export const findAndStoreUserDetails = async (hubSerialNumber) => {
  const state = store.getState();
  const { email } = state.user;

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
    const currentUrl = getCurrentUrl();

    const res = await axios.get(`${currentUrl}api/users/${userId}/permissions`, {
      params: { hubSerialNumber },
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
};

export const updateUserPermissions = async (targetUserId, roomIds, hubSerialNumber) => {
  const state = store.getState();
  const token = state.user.localToken;
  const currentUrl = getCurrentUrl();

  const payload = { targetUserId, roomIds };

  try {
    const res = await axios.post(`${currentUrl}api/users/update-permissions`, payload, {
      headers: {
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
  const currentUrl = getCurrentUrl();

  try {
    const res = await axios.delete(`${currentUrl}api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      params: { hubSerialNumber },
    });

    console.log('User deleted successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error deleting user:', err.response?.data || err.message);
    throw err;
  }
};
