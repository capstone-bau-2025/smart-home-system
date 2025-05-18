package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.dto.CommandDTO;
import com.capstonebau2025.centralhub.entity.Command;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.exception.DeviceConnectionException;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.CommandRepository;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommandService {

    private final MqttMessageProducer mqttMessageProducer;
    private final DeviceRepository deviceRepository;
    private final CommandRepository commandRepository;

    public void executeCommand(Long deviceId, Long commandId) {

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));
        Command command = commandRepository.findById(commandId)
                .orElseThrow(() -> new ResourceNotFoundException("Command not found with ID: " + commandId));

        if(command.getModel().getId() != device.getModel().getId())
            throw new ValidationException("Command not applicable for this device");

        if(mqttMessageProducer.sendCommand(device.getUid(), command.getNumber()))
            throw new DeviceConnectionException("Device not responding");
    }

    public List<CommandDTO> getAllByDeviceId(Long id) {
        return commandRepository.findAllByDeviceId(id).stream()
                .map(command -> CommandDTO.builder()
                        .id(command.getId())
                        .name(command.getName())
                        .build())
                .toList();
    }
}

