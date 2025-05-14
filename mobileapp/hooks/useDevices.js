import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceByArea } from '../api/services/deviceService';
import { setDevices } from '../store/slices/devicesSlice';
export default function useDevices(hubSerialNumber, areas) {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDevices = useCallback(
    async (force = false) => {
      if (!hubSerialNumber || !areas?.length) return;

      if (!force && devices?.length > 0) {
        
        return;
      }

      const validAreas = areas.filter((a) => a?.id);
      if (!validAreas.length) {
        console.warn("❌ No valid areaIds to fetch devices for.");
        return;
      }

      setIsLoading(true);
      try {
        const deviceGroups = await Promise.all(
          validAreas.map((area) => getDeviceByArea(area.id, hubSerialNumber))
        );
        const allDevices = deviceGroups.flat();
        dispatch(setDevices(allDevices));
      } catch (error) {
        console.error("❌ Error fetching devices:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [hubSerialNumber, areas, dispatch, devices]
  );

  useEffect(() => {
    fetchDevices(); 
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    refetchDevices: () => fetchDevices(true), 
  };
}
