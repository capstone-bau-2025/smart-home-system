package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DeviceService extends GenericServiceImpl<Device, Long> {

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        setRepository(deviceRepository);
    }

    public Device create(Device deviceModel) {
        return super.create(deviceModel);
    }

    public Device update(Device deviceModel) {
        return super.update(deviceModel);
    }

    public Optional<Device> getById(Long id) {
        return super.getById(id);
    }

    public Iterable<Device> getAll() {
        return super.getAll();
    }

    public void deleteById(Long id) {
        super.deleteById(id);
    }

    public void delete(Device deviceModel) {
        super.delete(deviceModel);
    }
}
