package com.capstonebau2025.centralhub.service.device;

import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.entity.State;
import com.capstonebau2025.centralhub.entity.StateValue;
import com.capstonebau2025.centralhub.exception.DeviceConnectionException;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.StateValueRepository;
import com.capstonebau2025.centralhub.service.mqtt.MqttMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor()
public class StateService {

    private final StateValueRepository stateValueRepository;
    private final MqttMessageProducer mqttMessageProducer;

    public void initializeDeviceStates(Device device) {
        if (device == null || device.getModel() == null || device.getModel().getStates() == null) {
            return;
        }

        List<State> states = device.getModel().getStates();
        List<StateValue> stateValues = new ArrayList<>();

        for (State state : states) {
            StateValue stateValue = StateValue.builder()
                    .name(device.getName() + "." +state.getName())
                    .device(device)
                    .state(state)
                    .stateValue("undefined")
                    .build();

            stateValues.add(stateValue);
        }

        // Save all state values
        stateValueRepository.saveAll(stateValues);
        fetchDeviceStatesAsync(device.getId());
    }

    /*
    * Update the state value of a device.
    *
    * @param id the ID of the StateValue to update
    * @param newValue the new value to set
    * @throws IllegalArgumentException if the StateValue is not found, or if the state is not mutable
    * */
    public void updateStateValue(Long id, String newValue) {
        // Find StateValue by id
        StateValue stateValue = stateValueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StateValue not found with ID: " + id));

        // Get State from StateValue
        State state = stateValue.getState();

        // Check if state is mutable
        if (!state.getIsMutable()) {
            throw new ValidationException("State is not mutable with ID: " + id);
        }

        // Validate the new value based on State type
        if (state.getType() == State.StateType.ENUM) {
            // For ENUM type, check if value exists in StateChoices
            boolean validChoice = state.getChoices().stream()
                    .anyMatch(choice -> choice.getName().equals(newValue));

            if (!validChoice) {
                throw new ValidationException("Invalid value: " + newValue);
            }
        } else {
            // For RANGE type, check if value is within range
            try {
                int value = Integer.parseInt(newValue);
                if (value < state.getMinRange() || value > state.getMaxRange()) {
                    throw new ValidationException(
                            "Invalid value. Must be between " + state.getMinRange() +
                                    " and " + state.getMaxRange());
                }
            } catch (NumberFormatException e) {
                throw new ValidationException("Invalid number format for RANGE type state");
            }
        }

        long deviceUid = stateValue.getDevice().getUid();
        int stateNumber = state.getNumber();

        // Send device the new value
        if(!mqttMessageProducer.setStateValue(deviceUid, stateNumber, newValue)) {
            throw new DeviceConnectionException("Failed to update state value on device: " + deviceUid);
        }

        // Update stored state value
        stateValue.setStateValue(newValue);
        stateValue.setLastUpdate(LocalDateTime.now());
        stateValueRepository.save(stateValue);
    }

    public String fetchState(Long id) {
        StateValue stateValue = stateValueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StateValue not found with ID: " + id));

        long deviceUid = stateValue.getDevice().getUid();
        int stateNumber = stateValue.getState().getNumber();

        String newValue = mqttMessageProducer.getStateValue(deviceUid, stateNumber); // TODO: validate newValue

        if (newValue == null)
            throw new DeviceConnectionException("Failed to fetch state from device: " + deviceUid);

        // Update stored state value
        stateValue.setStateValue(newValue);
        stateValue.setLastUpdate(LocalDateTime.now());
        stateValueRepository.save(stateValue);

        return newValue;
    }

    @Async
    public void fetchDeviceStatesAsync(Long deviceId) {
        CompletableFuture.runAsync(() -> {
            List<StateValue> stateValues = stateValueRepository.findByDeviceId(deviceId);
            for (StateValue stateValue : stateValues) {
                fetchState(stateValue.getId());
            }
        });
    }
}

