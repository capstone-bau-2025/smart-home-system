package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.repository.*;
import com.capstonebau2025.centralhub.service.device.CommandService;
import com.capstonebau2025.centralhub.service.device.StateService;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
@Slf4j
public class AutomationExecService {

    private final AutomationRuleRepository ruleRepository;
    private final AutomationTriggerRepository triggerRepository;
    private final AutomationActionRepository actionRepository;
    private final StateValueRepository stateValueRepository;
    private final EventRepository eventRepository;
    private final CommandService commandService;
    private final StateService stateService;


    private final Map<Long, AutomationRule> activeRules = new ConcurrentHashMap<>();
    private final Map<Long, Long> recentEvents = new ConcurrentHashMap<>();


    @PostConstruct
    public void getAllActiveRules() {
         ruleRepository.findAllByIsEnabledTrue().forEach(rule -> activeRules.put(rule.getId(), rule));
    }


    public void subscribeTrigger(Long ruleId) {
        ruleRepository.findById(ruleId).ifPresent(rule -> {
            if (Boolean.TRUE.equals(rule.getIsEnabled())) {
                activeRules.put(ruleId, rule);
                log.info("Subscribed rule {} for trigger type {}", ruleId, rule.getTriggerType());
            }
        });
    }

    public void unsubscribeTrigger(Long ruleId) {
        activeRules.remove(ruleId);
        log.info("Unsubscribed rule {} from trigger monitoring", ruleId);
    }

    @Scheduled(fixedRate = 60_000) // every minute
    @Transactional
    public void automationLoop() {
        for (AutomationRule rule : activeRules.values()) {
            try {
                AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId()).orElse(null);
                if (trigger == null) continue;

                // Check if the rule is in cooldown period
                if (rule.getLastExecutedTime() != null && rule.getCooldownDuration() > 0) {
                    if (isRuleInCooldown(rule)) {
                        continue;
                    }
                }

                boolean shouldExecute = switch (rule.getTriggerType()) {
                    case SCHEDULE -> checkScheduledTrigger(trigger);
                    case EVENT -> checkEventTrigger(trigger);
                    case STATUS_VALUE -> checkStateTrigger(trigger);
                };

                if (shouldExecute) {
                    log.info("Trigger met for rule: {}", rule.getName());
                    executeActions(rule);
                }
            } catch (Exception ex) {
                log.error("Error processing rule {}: {}", rule.getId(), ex.getMessage(), ex);
            }
        }
    }


    public boolean checkScheduledTrigger(AutomationTrigger trigger) {
        if (trigger.getScheduledTime() == null) return false;

        LocalTime now = LocalTime.now();
        LocalTime scheduledTime = trigger.getScheduledTime();

        // Convert both times to seconds since midnight for comparison
        long nowSeconds = now.toSecondOfDay();
        long scheduledSeconds = scheduledTime.toSecondOfDay();

        // Calculate the absolute difference in seconds
        long differenceInSeconds = Math.abs(nowSeconds - scheduledSeconds);

        // Check if current time is within ±60 seconds of scheduled time
        return differenceInSeconds <= 60;
    }


    public boolean checkEventTrigger(AutomationTrigger trigger) {
        if (trigger.getEvent() == null) return false;
        // Simply check if the event exists in recent events
        Long eventId = recentEvents.get(trigger.getEvent().getId());
        return eventId != null;
    }


    public boolean checkStateTrigger(AutomationTrigger trigger) {
        if (trigger.getStateValue() == null) return false;

        // Get the current state value from the repository instead of using trigger.getStateTriggerValue()
        StateValue currentState = stateValueRepository.findById(trigger.getStateValue().getId())
                .orElse(null);

        if (currentState == null) return false;

        String actualValue = currentState.getStateValue();
        String expectedValue = trigger.getStateTriggerValue(); // This is the condition value from the trigger

        // Check if both values can be parsed as numbers
        boolean isNumeric = isNumeric(actualValue) && isNumeric(expectedValue);

        if (isNumeric) {
            try {
                double actualNumeric = Double.parseDouble(actualValue);
                double expectedNumeric = Double.parseDouble(expectedValue);

                return switch (trigger.getOperator()) {
                    case EQUAL -> actualNumeric == expectedNumeric;
                    case GREATER -> actualNumeric > expectedNumeric;
                    case LESS -> actualNumeric < expectedNumeric;
                    case GREATER_OR_EQUAL -> actualNumeric >= expectedNumeric;
                    case LESS_OR_EQUAL -> actualNumeric <= expectedNumeric;
                };
            } catch (NumberFormatException e) {
                log.warn("Failed to parse numeric values despite validation: {}, {}", actualValue, expectedValue);
                return false;
            }
        } else {
            // For string values, only EQUAL operator is supported
            return switch (trigger.getOperator()) {
                case EQUAL -> actualValue.equals(expectedValue);
                default -> {
                    log.warn("Non-numeric comparison attempted with non-EQUAL operator: {}", trigger.getOperator());
                    yield false;
                }
            };
        }
    }

    public void addEvent(long eventId , long deviceId) {
        // Find the event from the repository
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        // Add the event to the recent events list
        recentEvents.put(event.getId(), event.getId());
    }

    private boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isRuleInCooldown(AutomationRule rule) {
            LocalTime now = LocalTime.now();
            LocalTime lastExecuted = rule.getLastExecutedTime();

            long secondsSinceLastExecution;

            // Handle day boundary case (if now is earlier than lastExecuted, it crossed midnight)
            if (now.isBefore(lastExecuted)) {
                secondsSinceLastExecution = 86400 - lastExecuted.toSecondOfDay() + now.toSecondOfDay();
            } else {
                secondsSinceLastExecution = now.toSecondOfDay() - lastExecuted.toSecondOfDay();
            }

            // If the cooldown period has passed, clear the lastExecutedTime
            if (secondsSinceLastExecution >= rule.getCooldownDuration()) {
                rule.setLastExecutedTime(null);
                ruleRepository.save(rule);
                log.debug("Cooldown period expired for rule {}", rule.getName());
                return false; // Not in cooldown anymore
            } else {
                // Still in cooldown period, skip this rule
                log.debug("Rule {} is in cooldown for {} more seconds",
                        rule.getName(), rule.getCooldownDuration() - secondsSinceLastExecution);
                return true; // Still in cooldown
            }
        }

    private void executeActions(AutomationRule rule) {
        try {
            // Get all actions for this rule
            List<AutomationAction> actions = actionRepository.findByAutomationRuleId(rule.getId());

            if (actions.isEmpty()) {
                log.warn("No actions found for rule: {}", rule.getName());
                return;
            }

            log.info("Executing {} actions for rule: {}", actions.size(), rule.getName());

            // Execute each action
            for (AutomationAction action : actions) {
                try {
                    switch (action.getType()) {
                        case COMMAND -> {
                            if (action.getCommand() != null) {
                                commandService.executeCommand(
                                        action.getDevice().getId(),
                                        action.getCommand().getId()
                                );
                                log.info("Successfully executed command action for rule {}", rule.getName());
                            } else {
                                log.warn("Command not specified for command action in rule {}", rule.getName());
                            }
                        }
                        case STATE_UPDATE -> {
                            if (action.getStateValue() != null) {
                                stateService.updateStateValue(
                                        action.getStateValue().getId(),
                                        action.getValue()
                                );
                                log.info("Successfully executed state update action for rule {}", rule.getName());
                            } else {
                                log.warn("State value not specified for state update action in rule {}", rule.getName());
                            }
                        }
                        default -> log.warn("Unknown action type for action {} in rule {}",
                                        action.getId(), rule.getName());
                    }
                } catch (Exception e) {
                    log.error("Error executing action {}: {}", action.getId(), e.getMessage(), e);
                }
            }

            // Update the last executed timestamp for the rule
            rule.setLastExecutedTime(LocalTime.now());

            // Set the cooldown duration from the user-specified value
            // This will be checked in the automationLoop method
            if (rule.getCooldownDuration() > 0) {
                log.info("Setting cooldown for rule {} to {} seconds", rule.getName(), rule.getCooldownDuration());
            }

            // Save the updated rule with the new lastExecutedTime
            ruleRepository.save(rule);

        } catch (Exception e) {
            log.error("Error executing actions for rule {}: {}", rule.getId(), e.getMessage(), e);
        }
    }

}








