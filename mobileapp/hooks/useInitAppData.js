import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails } from '../api/services/userService';
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
        const data = await fetchUserDetails(); // { email, username, hubsConnected: [ { name, role, serialNumber } ] }

        dispatch(setEmail(data.email));
        dispatch(setUsername(data.username));
        dispatch(setUserHubs(data.hubsConnected));

        if (data.hubsConnected.length > 0) {
          dispatch(setCurrentHub(data.hubsConnected[0])); // Default to first hub
        }

        console.log("✅ User details & hubs initialized:", data);
      } catch (err) {
        console.error("❌ Init error:", err);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [user.email]);
}
