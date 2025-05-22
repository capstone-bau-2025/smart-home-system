import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, fetchUsers } from '../api/services/userService';
import {
  setUserHubs,
  setCurrentHub,
} from '../store/slices/hubSlice';
import {
  setUserId,
  setUsername,
  setEmail,
} from '../store/slices/userSlice';

export default function useInitAppData() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initializedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const refetchUserData = useCallback(async () => {
    if (!user.email) return;

    setLoading(true);
    try {
      const data = await fetchUserDetails(); // { email, username, hubsConnected }

      dispatch(setEmail(data.email));
      dispatch(setUsername(data.username));
      dispatch(setUserHubs(data.hubsConnected));

    if (Array.isArray(data.hubsConnected) && data.hubsConnected.length > 0) {
        const defaultHub = data.hubsConnected[0];
        dispatch(setCurrentHub(defaultHub));

        // Fetch user ID
        const users = await fetchUsers(defaultHub.serialNumber);
        const matchedUser = users.find((u) => u.email === data.email);
        if (matchedUser) {
          dispatch(setUserId(matchedUser.id));
        }
      }

      console.log('✅ User data refetched:', data);
    } catch (err) {
      console.error('❌ Refetch user data failed:', err);
    } finally {
      setLoading(false);
      initializedRef.current = true;
    }
  }, [user.email, dispatch]);

  useEffect(() => {
    if (!user.email || initializedRef.current) return;
    refetchUserData();
  }, [user.email, refetchUserData]);

  return {
    refetchUserData,
    isLoadingUserData: loading,
  };
}
