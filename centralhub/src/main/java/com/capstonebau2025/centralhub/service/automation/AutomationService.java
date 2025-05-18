package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.dto.ActionDTO;
import com.capstonebau2025.centralhub.dto.AutomationDTO;
import com.capstonebau2025.centralhub.dto.RemoteRequests.CreateAutomationRequest;
import com.capstonebau2025.centralhub.dto.RemoteRequests.ToggleAutomationRequest;
import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.exception.ApplicationException;
import com.capstonebau2025.centralhub.exception.ResourceNotFoundException;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AutomationService {
    private final AutomationRuleRepository ruleRepository;
    private final AutomationTriggerRepository triggerRepository;
    private final AutomationActionRepository actionRepository;
    private final DeviceRepository deviceRepository;
    private final CommandRepository commandRepository;
    private final AutomationExecService automationExecService;
    private final EventRepository eventRepository;
    private final StateValueRepository stateValueRepository;


    @Transactional
    public AutomationDTO createAutomation(CreateAutomationRequest request , User user) {

        AutomationRule.TriggerType triggerType;
        try {
            triggerType = AutomationRule.TriggerType.valueOf(request.getTriggerType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid trigger type: " + request.getTriggerType());
        }

        AutomationRule rule = AutomationRule.builder()
                .createdBy(user)
                .name(request.getRuleName())
                .description(request.getRuleDescription())
                .isEnabled(true)
                .triggerType(triggerType)
                .cooldownDuration(request.getCooldownDuration())
                .build();

        AutomationRule savedRule = ruleRepository.save(rule);

        switch (triggerType) {
            case SCHEDULE -> {
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .scheduledTime(LocalTime.parse(request.getScheduledTime()))
                        .build();
                triggerRepository.save(trigger);
            }
            case EVENT -> {
                Event event = eventRepository.findById(request.getEventId())
                        .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
                Device device = deviceRepository.findById(request.getDeviceId())
                        .orElseThrow(() -> new ResourceNotFoundException("trigger device not found "));
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .event(event)
                        .device(device)  // Optional: set device if your entity supports it
                        .build();
                triggerRepository.save(trigger);
            }
            case STATE_UPDATE -> {
                StateValue stateValue = stateValueRepository.findById(request.getStateValueId())
                        .orElseThrow(() -> new ResourceNotFoundException("State value not found"));
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .stateValue(stateValue)
                        .stateTriggerValue(request.getStateTriggerValue())
                        .device(stateValue.getDevice())  // Optional: set device if your entity supports it
                        .build();
                triggerRepository.save(trigger);
            }
            default -> throw new IllegalArgumentException("Unsupported trigger type: " + triggerType);
        }

        // add actionDto and map to action entity
        for (ActionDTO actionDto : request.getActions()) {
            Device device = deviceRepository.findById(actionDto.getDeviceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Device not found"));

            AutomationAction action = AutomationAction.builder()
                    .automationRule(savedRule)
                    .device(device)
                    .type(AutomationAction.ActionType.valueOf(actionDto.getType().toUpperCase()))
                    .build();

            switch (action.getType()) {
                case COMMAND -> {
                    action.setCommand(commandRepository.findById(actionDto.getCommandId())
                            .orElseThrow(() -> new ValidationException("Command not found")));
                }
                case STATE_UPDATE -> {
                    action.setStateValue(stateValueRepository.findById(actionDto.getStateValueId())
                            .orElseThrow(() -> new ValidationException("State value not found")));
                    action.setValue(actionDto.getActionValue());
                }
                default -> throw new ValidationException("Unsupported action type: " + action.getType());
            }

            actionRepository.save(action);
        }

        automationExecService.subscribeTrigger(savedRule.getId());
        return mapToDto(savedRule);
    }

    @Transactional
    public AutomationDTO toggleAutomation(ToggleAutomationRequest request) {
        AutomationRule rule = ruleRepository.findById(request.getRuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

       // Set the enabled state using the provided parameter
       rule.setIsEnabled(request.getIsEnabled());

        // Save the updated rule
        AutomationRule savedRule = ruleRepository.save(rule);

        // Update subscription based on new state
        if (savedRule.getIsEnabled()) {
            automationExecService.subscribeTrigger(savedRule.getId());
        } else {
            automationExecService.unsubscribeTrigger(savedRule.getId());
        }
        return mapToDto(savedRule);
    }

    @Transactional
    public void deleteAutomation(Long ruleId) {
        AutomationRule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

        // Unsubscribe from triggers
        automationExecService.unsubscribeTrigger(rule.getId());
        ruleRepository.delete(rule);
    }

    public List<AutomationDTO> getAllAutomations() {
        return ruleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    private AutomationDTO mapToDto(AutomationRule rule) {
        AutomationDTO.AutomationDTOBuilder builder = AutomationDTO.builder()
                .id(rule.getId())
                .ruleName(rule.getName())
                .ruleDescription(rule.getDescription())
                .isEnabled(rule.getIsEnabled())
                .triggerType(rule.getTriggerType().toString())
                .cooldownDuration(rule.getCooldownDuration());

        AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId())
                .orElseThrow(() -> new ApplicationException("No trigger found for automation rule", HttpStatus.INTERNAL_SERVER_ERROR));

        switch (rule.getTriggerType()) {
            case EVENT:
                builder.eventId(trigger.getEvent().getId());
                builder.deviceId(trigger.getDevice().getId());
                break;
            case STATE_UPDATE:
                builder.stateValueId(trigger.getStateValue().getId());
                builder.stateTriggerValue(trigger.getStateTriggerValue());
                break;
            case SCHEDULE:
                builder.scheduledTime(trigger.getScheduledTime().toString());
                break;
        }

        List<AutomationAction> actions = actionRepository.findByAutomationRuleId(rule.getId());

        if (actions != null && !actions.isEmpty()) {
            List<ActionDTO> actionDTOs = actions.stream()
                    .map(action -> ActionDTO.builder()
                            .deviceId(action.getDevice().getId())
                            .type(action.getType().toString())
                            .commandId(action.getCommand() != null ? action.getCommand().getId() : null)
                            .stateValueId(action.getStateValue() != null ? action.getStateValue().getId() : null)
                            .actionValue(action.getValue())
                            .build())
                    .collect(java.util.stream.Collectors.toList());
            builder.actions(actionDTOs);
        }

        return builder.build();
    }
}
