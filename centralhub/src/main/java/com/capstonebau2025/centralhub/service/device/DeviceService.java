package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.dto.DeviceInfoDTO;
import com.capstonebau2025.centralhub.dto.IdNameDTO;
import com.capstonebau2025.centralhub.entity.Area;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.helper.MqttUserControl;
import com.capstonebau2025.centralhub.repository.AreaRepository;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final MqttMessageProducer mqttMessageProducer;
    private final AreaRepository areaRepository;
    private final MqttUserControl mqttUserControl;
    private final ObjectMapper mapper;

    public void setDeviceName(Long id, String name) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + id));

        device.setName(name);
        deviceRepository.save(device);

        // TODO: update its state value names too
    }

    public void setDeviceArea(Long id, Long areaId) {

        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + id));

        Area area = areaRepository.findById(areaId)
                .orElseThrow(() -> new ResourceNotFoundException("Area not found with ID: " + areaId));

        device.setArea(area);
        deviceRepository.save(device);

    }

    public boolean pingDevice(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + id));

        // TODO: if not pinging update device status to not responding
        return mqttMessageProducer.pingDevice(device.getUid());
    }

    public List<DeviceInfoDTO> getDevicesByArea(Long areaId) {
        if(!areaRepository.existsById(areaId))
            throw new ResourceNotFoundException("Area not found with ID: " + areaId);

        // TODO: return only if user has permission to this area

        return deviceRepository.findByAreaId(areaId).stream()
                .map(device -> DeviceInfoDTO.builder()
                        .id(device.getId())
                        .uid(device.getUid())
                        .name(device.getName())
                        .status(device.getStatus())
                        .lastSeen(device.getLastSeen().toString())
                        .createdAt(device.getCreatedAt().toString())
                        .model(device.getModel().getModel())
                        .modelName(device.getModel().getName())
                        .description(device.getModel().getDescription())
                        .type(device.getModel().getType())
                        .build())
                .toList();
    }

    public List<IdNameDTO> getDevicesByFilter(String filter) {
        List<Device> devices = switch (filter.toUpperCase()) {
            case "EVENT" ->
                    deviceRepository.findByModelEventsIsNotEmpty();
            case "COMMAND" ->
                    deviceRepository.findByModelCommandsIsNotEmpty();
            case "IMMUTABLE_STATE" ->
                    deviceRepository.findByModelImmutableStatesIsNotEmpty();
            case "MUTABLE_STATE" ->
                    deviceRepository.findByModelMutableStatesIsNotEmpty();
            default ->
                    deviceRepository.findAll();
        };

        return devices.stream()
                .map(device -> new IdNameDTO(device.getId(), device.getName()))
                .toList();
    }

    public void deleteDevice(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + id));

        // Send MQTT deletion message & delete mqtt user
        ObjectNode message = mapper.createObjectNode()
                .put("message_type", "DELETED");
        CompletableFuture.runAsync(() -> mqttMessageProducer.sendMessage(device.getUid(), message));
        mqttUserControl.deleteUserIfExists("device-" + device.getUid());

        // delete the device
        deviceRepository.delete(device);
    }
}
