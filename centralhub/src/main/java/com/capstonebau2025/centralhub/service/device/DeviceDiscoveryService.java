package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.dto.DeviceDetailsDTO;
import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.repository.*;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceDiscoveryService {

    private final PendingDiscoveryService pendingDiscoveryService;
    private final MqttMessageProducer mqttMessageProducer;
    private final StateService stateService;
    private final DeviceModelRepository deviceModelRepository;
    private final DeviceRepository deviceRepository;
    private final AreaRepository areaRepository;
    private final StateRepository stateRepository;
    private final CommandRepository commandRepository;
    private final EventRepository eventRepository;

    /**
     * Returns a map of all the devices pending for discovery.
     *
     * @return a map of device unique identifiers to their details
     */
    public Map<Long, DeviceDetailsDTO> getDiscoveredDevices() {
        return pendingDiscoveryService.getAllPendingDevices();
    }

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
    @Transactional
    public DeviceDetailsDTO pairDevice(Long deviceUid) {

        // get device details from pending discovery service
        DeviceDetailsDTO deviceDetails = pendingDiscoveryService.removePendingDevice(deviceUid);
        if (deviceDetails == null) return null;

        Device.DeviceBuilder deviceBuilder = Device.builder()
                .uid(deviceDetails.getUid())
                .name(deviceDetails.getName() != null ? deviceDetails.getName() : deviceDetails.getModel())
                .area(areaRepository.findGeneralArea())
                .status(Device.DeviceStatus.CONNECTED);

        // get device model
        Optional<DeviceModel> deviceModel = deviceModelRepository.findByModel(deviceDetails.getModel());

        // use device model if exists, otherwise create a new one
        if (deviceModel.isPresent()) {
            deviceBuilder.model(deviceModel.get());
        }
        else {
            DeviceModel newDeviceModel = createDeviceModel(deviceDetails);
            deviceBuilder.model(newDeviceModel);
        }

        // save the new device
        Device newDevice = deviceRepository.save(deviceBuilder.build());

        // send credentials to the device through error in case device didn't respond
        if(!mqttMessageProducer.sendDeviceCredentials(deviceDetails.getUid())) {
            throw new RuntimeException("device is not responding couldn't pair: " + deviceDetails.getUid());
        }

        // create device StateValue entities and fetch state from device
        stateService.initializeDeviceStates(newDevice);

        return deviceDetails;
    }

    @Transactional
    public DeviceModel createDeviceModel(DeviceDetailsDTO deviceDetails) {

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

        // Update the DeviceModel and return it
        return deviceModelRepository.save(newDeviceModel);
    }
}
