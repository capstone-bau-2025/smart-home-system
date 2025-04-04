package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.entity.Command;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.repository.CommandRepository;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommandService {

    private final MqttMessageProducer mqttMessageProducer;
    private final DeviceRepository deviceRepository;
    private final CommandRepository commandRepository;

    public boolean executeCommand(Long deviceId, Long commandId) {

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));
        Command command = commandRepository.findById(commandId)
                .orElseThrow(() -> new IllegalArgumentException("Command not found"));

        return mqttMessageProducer.sendCommand(device.getUid(), command.getNumber());
    }
}

