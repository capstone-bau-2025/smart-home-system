import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHubs } from '../api/services/hubService';
import { findAndStoreUserDetails } from '../api/services/userService';
import { addUserHub, setCurrentHub } from '../store/slices/hubSlice';

export default function useInitAppData() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!user.email || initialized) return;

      try {
        await findAndStoreUserDetails();

        const response = await fetchHubs();
        const hub = response?.data;

        if (hub?.serialNumber) {
          dispatch(addUserHub(hub));
          dispatch(setCurrentHub({
            serialNumber: hub.serialNumber,
            hubName: hub.name,
            hubDetails: {
              location: hub.location,
              status: hub.status,
              name: hub.name,
            },
          }));
          console.log("App initialized hub:", hub);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [user.email]);
}
