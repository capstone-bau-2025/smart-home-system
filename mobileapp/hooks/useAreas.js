import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAreas } from '../api/services/areaService'; 
import { setAreas } from '../store/slices/areaSlice';

export default function useAreas(hubSerialNumber) {
  const dispatch = useDispatch();
  const areas = useSelector((state) => state.area.areas);
  const [isLoading, setIsLoading] = useState(false);

  const refetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAreas(hubSerialNumber);
      dispatch(setAreas(response.data));
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchAreas();
  }, [hubSerialNumber]);

  return { areas, isLoading, refetchAreas };
}
