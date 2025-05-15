package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.dto.ActionDTO;
import com.capstonebau2025.centralhub.dto.AutomationDTO;
import com.capstonebau2025.centralhub.dto.CreateAutomationRuleDTO;
import com.capstonebau2025.centralhub.dto.ToggleAutomationRuleDto;
import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.exception.ValidationException;
import com.capstonebau2025.centralhub.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
    public AutomationDTO createAutomation(CreateAutomationRuleDTO dto , User user) {

        AutomationRule.TriggerType triggerType;
        try {
            triggerType = AutomationRule.TriggerType.valueOf(dto.getTriggerType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid trigger type: " + dto.getTriggerType());
        }

        AutomationRule rule = AutomationRule.builder()
                .createdBy(user)
                .name(dto.getRuleName())
                .description(dto.getRuleDescription())
                .isEnabled(true)
                .triggerType(triggerType)
                .cooldownDuration(dto.getCooldownDuration())
                .build();

        AutomationRule savedRule = ruleRepository.save(rule);

        switch (triggerType) {
            case SCHEDULE -> {
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .scheduledTime(LocalTime.parse(dto.getScheduledTime()))
                        .build();
                triggerRepository.save(trigger);
            }
            case EVENT -> {
                Event event = eventRepository.findById(dto.getEventId())
                        .orElseThrow(() -> new EntityNotFoundException("Event not found"));
                Device device = deviceRepository.findById(dto.getDeviceId())
                        .orElseThrow(() -> new EntityNotFoundException("trigger device not found "));
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .event(event)
                        .device(device)  // Optional: set device if your entity supports it
                        .build();
                triggerRepository.save(trigger);
            }
            case STATUS_VALUE -> {
                StateValue stateValue = stateValueRepository.findById(dto.getStatusValueId())
                        .orElseThrow(() -> new EntityNotFoundException("State value not found"));
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .stateValue(stateValue)
                        .device(stateValue.getDevice())  // Optional: set device if your entity supports it
                        .build();
                triggerRepository.save(trigger);
            }
            default -> throw new IllegalArgumentException("Unsupported trigger type: " + triggerType);
        }

        // add actionDto and map to action entity
        for (ActionDTO actionDto : dto.getActions()) {
            Device device = deviceRepository.findById(actionDto.getDeviceId())
                    .orElseThrow(() -> new EntityNotFoundException("Device not found"));

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
                    action.setStateValue(stateValueRepository.findById(actionDto.getStatusValueId())
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
    public AutomationDTO toggleAutomation(ToggleAutomationRuleDto toggleAutomationRule) {
        AutomationRule rule = ruleRepository.findById(toggleAutomationRule.getRuleId())
                .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

       // Set the enabled state using the provided parameter
       rule.setIsEnabled(toggleAutomationRule.getIsEnabled());

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
    public void deleteAutomationRule(Long ruleId) {
        AutomationRule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

        // Unsubscribe from triggers
        automationExecService.unsubscribeTrigger(rule.getId());
        ruleRepository.delete(rule);
    }

    public List<AutomationDTO> getAllAutomationRules() {
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
                .orElse(null);

        if (trigger != null) {
            switch (rule.getTriggerType()) {
                case EVENT:
                    if (trigger.getEvent() != null) {
                        builder.eventId(trigger.getEvent().getId());
                    }
                    if (trigger.getDevice() != null) {
                        builder.deviceId(trigger.getDevice().getId());
                    }
                    break;
                case STATUS_VALUE:
                    if (trigger.getStateValue() != null) {
                        builder.statusValueId(trigger.getStateValue().getId());
                    }
                    break;
                case SCHEDULE:
                    if (trigger.getScheduledTime() != null) {
                        builder.scheduledTime(trigger.getScheduledTime().toString());
                    }
                    break;
            }
        }

        List<AutomationAction> actions = actionRepository.findByAutomationRuleId(rule.getId());

        if (actions != null && !actions.isEmpty()) {
            List<ActionDTO> actionDTOs = actions.stream()
                    .map(action -> ActionDTO.builder()
                            .deviceId(action.getDevice().getId())
                            .type(action.getType().toString())
                            .commandId(action.getCommand() != null ? action.getCommand().getId() : null)
                            .statusValueId(action.getStateValue() != null ? action.getStateValue().getId() : null)
                            .actionValue(action.getValue())
                            .build())
                    .collect(java.util.stream.Collectors.toList());
            builder.actions(actionDTOs);
        }

        return builder.build();
    }
}
