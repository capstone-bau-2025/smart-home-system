package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.dto.CreateAutomationRuleDto;
import com.capstonebau2025.centralhub.dto.ToggleAutomationRuleDto;
import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

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
    private final UserRepository userRepository;



    @Transactional
    public AutomationRule createAutomation(CreateAutomationRuleDto dto , User user) {

        AutomationRule.TriggerType triggerType;
        try {
            triggerType = AutomationRule.TriggerType.valueOf(dto.getTriggerType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid trigger type: " + dto.getTriggerType());
        }

        LocalTime scheduledTime = null;
        if (triggerType == AutomationRule.TriggerType.SCHEDULE) {
            if (dto.getScheduledTime() == null) {
                throw new RuntimeException("Scheduled time is required for SCHEDULE trigger type.");
            }
            scheduledTime = LocalTime.parse(dto.getScheduledTime());
        }

        AutomationRule rule = AutomationRule.builder()
                .createdBy(user)
                .name(dto.getRuleName())
                .description(dto.getRuleDescription())
                .isEnabled(dto.getIsEnabled() != null ? dto.getIsEnabled() : true)
                .triggerType(triggerType)
                .cooldownDuration(dto.getCooldownDuration())
                .scheduledTime(scheduledTime)
                .build();


        AutomationRule savedRule = ruleRepository.save(rule);

        switch (triggerType) {
            case SCHEDULE -> {
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .build();
                triggerRepository.save(trigger);
            }
            case EVENT -> {
                Event event = eventRepository.findById(dto.getEventId())
                        .orElseThrow(() -> new EntityNotFoundException("Event not found"));
                AutomationTrigger trigger = AutomationTrigger.builder()
                        .automationRule(savedRule)
                        .event(event)
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
        if (dto.getIsEnabled()) {
            automationExecService.subscribeTrigger(savedRule.getId());
        }

        return savedRule;

    }




    @Transactional
    public AutomationRule toggleAutomation(ToggleAutomationRuleDto toggleAutomationRule) {
        AutomationRule rule = ruleRepository.findById(toggleAutomationRule.getRuleId())
                .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

        // Toggle the enabled state
       // Set the enabled state using the provided parameter
       rule.setIsEnabled(toggleAutomationRule.getIsEnabled() != null
               ? toggleAutomationRule.getIsEnabled() : !rule.getIsEnabled());

        // Save the updated rule
        AutomationRule savedRule = ruleRepository.save(rule);

        // Update subscription based on new state
        if (savedRule.getIsEnabled()) {
            automationExecService.subscribeTrigger(savedRule.getId());
        } else {
            automationExecService.unsubscribeTrigger(savedRule.getId());
        }
        return savedRule;
    }


    @Transactional
    public String deleteAutomationRule (Long ruleId) {
        AutomationRule rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

        // Unsubscribe from triggers
        automationExecService.unsubscribeTrigger(rule.getId());

        ruleRepository.delete(rule);

        return "Automation rule deleted successfully";
    }
}



