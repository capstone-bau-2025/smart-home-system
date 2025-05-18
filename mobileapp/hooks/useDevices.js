import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceByArea } from "../api/services/deviceService";
import { fetchAllInteractions } from "../api/services/interactionService";
import { setDevices } from "../store/slices/devicesSlice";

export default function useDevices(hubSerialNumber, areas) {
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.devices);
  const [isLoading, setIsLoading] = useState(false);


  const fetchDevices = useCallback(
    async (force = false) => {
      if (!hubSerialNumber || !areas?.length) return;
      if (!force && devices?.length > 0) return;

      setIsLoading(true);

      try {
        const interactionsByArea = await fetchAllInteractions();

        const deviceMetaPerArea = await Promise.all(
          interactionsByArea.map((area) =>
            getDeviceByArea(area.areaId, hubSerialNumber).then((list) => ({
              areaId: area.areaId,
              list,
            }))
          )
        );

        const metaMap = {};
        deviceMetaPerArea.forEach(({ list }) => {
          list.forEach((device) => {
            metaMap[device.id] = device;
          });
        });

        const enrichedDevices = interactionsByArea.flatMap((area) => {
          const grouped = {};

          area.interactions.forEach((interaction) => {
            const deviceId = interaction.deviceId;
            if (!grouped[deviceId]) {
              const meta = metaMap[deviceId] || {};
              grouped[deviceId] = {
                ...meta,
                id: deviceId,
                uid: meta.uid ?? null,
                areaId: area.areaId,
                areaName: area.areaName,
                name: meta.name ?? interaction.name.split(".")[0],
                model: meta.model,
                description: meta.description,
                category: interaction.category,
                interactions: [],
              };
            }
            grouped[deviceId].interactions.push(interaction);
          });

          return Object.values(grouped);
        });

        
        dispatch(setDevices(enrichedDevices));
      } catch (err) {
        console.error("❌ Error in useDevices:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [hubSerialNumber, areas, dispatch]

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
