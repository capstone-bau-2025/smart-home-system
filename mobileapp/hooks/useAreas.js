import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAreas } from "../api/services/areaService";
import { setAreas } from "../store/slices/areaSlice";

export default function useAreas(hubSerialNumber) {
  const dispatch = useDispatch();
  const areas = useSelector((state) => state.areas.areas);
  const [isLoading, setIsLoading] = useState(false);

  // This always triggers an area fetch
  const refetchAreas = async () => {
    if (!hubSerialNumber) return;
    setIsLoading(true);
    try {
      const response = await fetchAreas(hubSerialNumber);
      dispatch(setAreas(response.data || []));
    } catch (error) {
      console.error("❌ Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    refetchAreas();
  }, [hubSerialNumber]);

  return { areas, isLoading, refetchAreas };
}
