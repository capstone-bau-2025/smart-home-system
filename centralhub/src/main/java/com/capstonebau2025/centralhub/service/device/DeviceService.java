package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final AreaRepository areaRepository;

    public void setDeviceName(Long id, String name) {
        Optional<Device> device = deviceRepository.findById(id);
        device.ifPresent(value -> {
            value.setName(name);
            deviceRepository.save(value);
        });
    }

    public void setDeviceArea(Long id, Long areaId) {
        Optional<Device> device = deviceRepository.findById(id);
        Optional<Area> area = areaRepository.findById(areaId);
        if (device.isPresent() && area.isPresent()) {
            device.get().setArea(area.get());
            deviceRepository.save(device.get());
        }
    }

    public boolean pingDevice(Long id) {
        // TODO: Implement ping logic
        return true;
    }
}
