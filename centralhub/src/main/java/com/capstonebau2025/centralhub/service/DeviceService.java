package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.DeviceDetails;
import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.repository.*;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import com.capstonebau2025.centralhub.service.mqtt.PendingDiscoveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService{

    private final PendingDiscoveryService pendingDiscoveryService;
    private final MqttMessageProducer mqttMessageProducer;
    private final DeviceModelRepository deviceModelRepository;
    private final DeviceRepository deviceRepository;
    private final AreaRepository areaRepository;
    private final StateRepository stateRepository;
    private final CommandRepository commandRepository;
    private final EventRepository eventRepository;

    /**
     * Registers a pending device by its unique identifier.
     * <p>
     * removes the device from pending,
     * creates a new device in the database,
     * and sends the credentials to the device
     *
     * @param deviceUid the unique identifier of the device
     * @return the details of the registered device, or null if registration fails
     */
    public DeviceDetails registerDevice(Long deviceUid) {

        DeviceDetails deviceDetails = pendingDiscoveryService.removePendingDevice(deviceUid);
        if (deviceDetails == null) return null;

        Device.DeviceBuilder deviceBuilder = Device.builder()
                .uid(deviceDetails.getUid())
                .name(deviceDetails.getName() != null ? deviceDetails.getName() : deviceDetails.getModel())
                .area(areaRepository.findGeneralArea())
                .status(Device.DeviceStatus.CONNECTED);

        Optional<DeviceModel> deviceModel = deviceModelRepository.findByModel(deviceDetails.getModel());
        if (deviceModel.isPresent()) {
            deviceBuilder.model(deviceModel.get());
        }
        else {

            // Create the DeviceModel first (without states)
            DeviceModel newDeviceModel = DeviceModel.builder()
                    .model(deviceDetails.getModel())
                    .type(deviceDetails.getType())
                    .supportStreaming(deviceDetails.isSupportStreaming())
                    .name(deviceDetails.getName())
                    .description(deviceDetails.getDescription())
                    .build();

            // Save the DeviceModel to get an ID
            deviceModelRepository.save(newDeviceModel);

            // Create states with reference to the saved DeviceModel
            List<State> states = new ArrayList<>();
            if (deviceDetails.getStates() != null && !deviceDetails.getStates().isEmpty()) {
                states = deviceDetails.getStates().stream().map(stateDetails -> {
                    State state = State.builder()
                            .number(stateDetails.getNumber())
                            .isMutable(stateDetails.isMutable())
                            .name(stateDetails.getName())
                            .type(stateDetails.getType())
                            .minRange(stateDetails.getMinRange())
                            .maxRange(stateDetails.getMaxRange())
                            .model(newDeviceModel)
                            .build();

                    // Handle choices separately since they need the state reference
                    if (stateDetails.getChoices() != null && stateDetails.getType() == State.StateType.ENUM) {
                        Set<StateChoice> choices = stateDetails.getChoices().stream()
                                .map(choiceName -> StateChoice.builder()
                                        .name(choiceName)
                                        .state(state)
                                        .build())
                                .collect(Collectors.toSet());
                        state.setChoices(choices);
                    }

                    return state;
                }).toList();
            }

            List<Command> commands = new ArrayList<>();
            if (deviceDetails.getCommands() != null && !deviceDetails.getCommands().isEmpty()) {
                commands = deviceDetails.getCommands().stream().map(commandDetails -> Command.builder()
                        .model(newDeviceModel)
                        .number(commandDetails.getNumber())
                        .name(commandDetails.getName())
                        .description(commandDetails.getDescription())
                        .build()).toList();
            }

            List<Event> events = new ArrayList<>();
            if (deviceDetails.getEvents() != null && !deviceDetails.getEvents().isEmpty()) {
                events = deviceDetails.getEvents().stream().map(eventDetails -> Event.builder()
                        .model(newDeviceModel)
                        .number(eventDetails.getNumber())
                        .name(eventDetails.getName())
                        .description(eventDetails.getDescription())
                        .build()).toList();
            }

            // Save states, commands, and events
            List<State> savedStates = stateRepository.saveAll(states);
            List<Command> savedCommands = commandRepository.saveAll(commands);
            List<Event> savedEvents = eventRepository.saveAll(events);

            // Set the saved states back to the DeviceModel
            newDeviceModel.setStates(savedStates);
            newDeviceModel.setCommands(savedCommands);
            newDeviceModel.setEvents(savedEvents);

            // Update the DeviceModel
            deviceModelRepository.save(newDeviceModel);
            deviceBuilder.model(newDeviceModel);
        }

        Device newDevice = deviceRepository.save(deviceBuilder.build());

        // send credentials to the device and delete the device again if the credentials could not be sent
        if(!mqttMessageProducer.sendDeviceCredentials(deviceDetails.getUid())) {
            deviceRepository.delete(newDevice);
            return null;
        }

        return deviceDetails;
    }


    public Optional<Device> getById(Long id) {
        return deviceRepository.findById(id);
    }

    public Iterable<Device> getAll() {
        return deviceRepository.findAll();
    }

    public void deleteById(Long id) {
        deviceRepository.deleteById(id);
    }

}
