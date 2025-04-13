package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.helper.MqttUserControl;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final MqttMessageProducer mqttMessageProducer;
    private final AreaRepository areaRepository;
    private final MqttUserControl mqttUserControl;
    private final ObjectMapper mapper;

    public void setDeviceName(Long id, String name) {
        Optional<Device> device = deviceRepository.findById(id);
        device.ifPresent(value -> {
            value.setName(name);
            deviceRepository.save(value);
        });
        // TODO: update its state value names too
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
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // TODO: if not pinging update device status to not responding
        return mqttMessageProducer.pingDevice(device.getUid());
    }

    public List<DeviceInfoDTO> getDevicesByArea(Long areaId) {
        return deviceRepository.findByAreaId(areaId).stream()
                .map(device -> DeviceInfoDTO.builder()
                        .id(device.getId())
                        .uid(device.getUid())
                        .name(device.getName())
                        .status(device.getStatus())
                        .lastSeen(device.getLastSeen())
                        .createdAt(device.getCreatedAt())
                        .model(device.getModel().getModel())
                        .modelName(device.getModel().getName())
                        .description(device.getModel().getDescription())
                        .type(device.getModel().getType())
                        .build())
                .toList();
    }

    public void deleteDevice(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Send MQTT deletion message & delete mqtt user
        ObjectNode message = mapper.createObjectNode()
                .put("message_type", "DELETED");
        mqttMessageProducer.sendMessage(device.getUid(), message);
        mqttUserControl.deleteUserIfExists("device-" + device.getUid());

        // delete the device
        deviceRepository.delete(device);
    }
}
