package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.AreaInteractionsDTO;
import com.capstonebau2025.centralhub.dto.InteractionDTO;
import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.exception.PermissionException;
import com.capstonebau2025.centralhub.repository.DeviceRepository;
import com.capstonebau2025.centralhub.repository.StateValueRepository;
import com.capstonebau2025.centralhub.service.device.CommandService;
import com.capstonebau2025.centralhub.service.device.StateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDeviceInteractionService {

    private final PermissionService permissionService;
    private final StateValueRepository stateValueRepository;
    private final DeviceRepository deviceRepository;
    private final StateService stateService;
    private final CommandService commandService;

    @Transactional
    public AreaInteractionsDTO[] getAllInteractions(Long userId) {
        // Get all areas the user has permission to access
        List<Area> areas = permissionService.getPermittedAreas(userId);

        // Create list to hold the result
        List<AreaInteractionsDTO> interactionAreas = new ArrayList<>();

        for (Area area : areas) {

            List<Device> devices = deviceRepository.findByAreaId(area.getId());
            List<InteractionDTO> interactions = new ArrayList<>();

            for (Device device : devices) {
                // Get all state values for this device
                List<StateValue> stateValues = stateValueRepository.findByDeviceId(device.getId());
                String category = device.getModel().getType().name();

                // Process states based on their type
                for (StateValue stateValue : stateValues) {
                    State state = stateValue.getState();

                    if (!state.getIsMutable()) {
                        // INFO type for immutable states
                        interactions.add(InteractionDTO.builder()
                                .type(InteractionDTO.InteractionType.INFO)
                                .name(stateValue.getName())
                                .deviceId(device.getId())
                                .category(category)
                                .stateValueId(stateValue.getId())
                                .value(stateValue.getStateValue())
                                .build());

                    } else if (state.getType() == State.StateType.RANGE) {
                        // RANGE type for numeric range states
                        interactions.add(InteractionDTO.builder()
                                .type(InteractionDTO.InteractionType.RANGE)
                                .name(stateValue.getName())
                                .deviceId(device.getId())
                                .category(category)
                                .stateValueId(stateValue.getId())
                                .value(stateValue.getStateValue())
                                .min(state.getMinRange().toString())
                                .max(state.getMaxRange().toString())
                                .build());

                    } else if (state.getType() == State.StateType.ENUM) {
                        // CHOICE type for enum states
                        String[] choicesArray = state.getChoices().stream()
                                .map(StateChoice::getName)
                                .toArray(String[]::new);

                        interactions.add(InteractionDTO.builder()
                                .type(InteractionDTO.InteractionType.CHOICE)
                                .name(stateValue.getName())
                                .deviceId(device.getId())
                                .category(category)
                                .stateValueId(stateValue.getId())
                                .value(stateValue.getStateValue())
                                .choices(choicesArray)
                                .build());
                    }
                }

                // Process commands
                if (device.getModel().getCommands() != null) {
                    for (Command command : device.getModel().getCommands()) {
                        interactions.add(InteractionDTO.builder()
                                .type(InteractionDTO.InteractionType.COMMAND)
                                .name(command.getName())
                                .deviceId(device.getId())
                                .category(category)
                                .commandId(command.getId())
                                .build());
                    }
                }
            }

            // Create area DTO with all interactions
            interactionAreas.add(AreaInteractionsDTO.builder()
                    .areaName(area.getName())
                    .iconId(area.getIcon())
                    .areaId(area.getId())
                    .interactions(interactions.toArray(new InteractionDTO[0]))
                    .build());
        }

        return interactionAreas.toArray(new AreaInteractionsDTO[0]);
    }

    public void updateStateInteraction(Long userId, Long stateValueId, String value) {
        if(!permissionService.isPermittedStateValue(userId, stateValueId))
            throw new PermissionException("not permitted to access this device.");

        stateService.updateStateValue(stateValueId, value);
    }

    public void commandInteraction(Long userId, Long deviceId, Long commandId) {
        if(!permissionService.isPermittedDevice(userId, deviceId))
            throw new PermissionException("not permitted to access this device.");

        commandService.executeCommand(deviceId, commandId);
    }

    public String fetchStateInteraction(Long userId, Long stateValueId) {
        if(!permissionService.isPermittedStateValue(userId, stateValueId))
            throw new PermissionException("not permitted to access this device.");

        return stateService.fetchState(stateValueId);
    }
}
