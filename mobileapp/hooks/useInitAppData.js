import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, fetchUsers } from '../api/services/userService';
import { setUserHubs, setCurrentHub } from '../store/slices/hubSlice';
import { setUserId, setUsername, setEmail } from '../store/slices/userSlice';

export default function useInitAppData() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!user.email || initialized) return;

      try {
        const data = await fetchUserDetails(); // { email, username, hubsConnected }

        dispatch(setEmail(data.email));
        dispatch(setUsername(data.username));
        dispatch(setUserHubs(data.hubsConnected));

        if (data.hubsConnected.length > 0) {
          const defaultHub = data.hubsConnected[0];
          dispatch(setCurrentHub(defaultHub));

          //GET THE USER ID
          const users = await fetchUsers(defaultHub.serialNumber);
          const matchedUser = users.find((u) => u.email === data.email);
          if (matchedUser) {
            dispatch(setUserId(matchedUser.id));
          }
        }

        console.log("✅ User details, hubs, and userId initialized:", data);
      } catch (err) {
        console.error("❌ Init error:", err);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [user.email]);
}
