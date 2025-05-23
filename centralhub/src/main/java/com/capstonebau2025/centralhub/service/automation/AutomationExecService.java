package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.repository.*;
import com.capstonebau2025.centralhub.service.NotificationService;
import com.capstonebau2025.centralhub.service.device.CommandService;
import com.capstonebau2025.centralhub.service.device.EventService;
import com.capstonebau2025.centralhub.service.device.StateService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final NotificationService notificationService;
    private final CommandService commandService;
    private final EventService eventService;
    private final StateService stateService;

    private final Map<Long, AutomationRule> activeRules = new ConcurrentHashMap<>();


    @PostConstruct
    public void getAllActiveRules() {
        log.info("loading automation rules");
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

    @Scheduled(fixedRate = 30_000) // every minute
    @Transactional
    public void automationLoop() {
        System.out.println("automation_loop");
        for (AutomationRule rule : activeRules.values()) {
            try {
                boolean shouldExecute = switch (rule.getTriggerType()) {
                    case SCHEDULE -> checkScheduledTrigger(rule);
                    case EVENT -> checkEventTrigger(rule);
                    case STATE_UPDATE -> checkStateTrigger(rule);
                };

                if (shouldExecute) {
                    if (rule.getLastExecutedTime() != null && rule.getCooldownDuration() > 0 && isRuleInCooldown(rule))
                        continue;
                    log.info("Trigger met for rule: {}", rule.getName());
                    executeActions(rule);
                }
            } catch (Exception ex) {
                log.error("Error processing rule {}: {}", rule.getId(), ex.getMessage(), ex);
            }
        }
        eventService.clearRecentEvents();
    }

    public boolean checkScheduledTrigger(AutomationRule rule) {
        AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId()).orElse(null);
        System.out.println("checking event schedule for rule id " + rule.getId());
        if (trigger == null || trigger.getScheduledTime() == null) {
            handleCorruptedRule(rule);
            return false;
        }

        LocalTime now = LocalTime.now();
        LocalTime scheduledTime = trigger.getScheduledTime();

        // Convert both times to seconds since midnight for comparison
        long nowSeconds = now.toSecondOfDay();
        long scheduledSeconds = scheduledTime.toSecondOfDay();

        // Calculate the absolute difference in seconds
        long differenceInSeconds = Math.abs(nowSeconds - scheduledSeconds);

        // Check if current time is within ±90 seconds of scheduled time
        return differenceInSeconds <= 90;
    }

    public boolean checkEventTrigger(AutomationRule rule) {
        AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId()).orElse(null);
        System.out.println("checking event schedule for rule id " + rule.getId());
        if (trigger == null || trigger.getEvent() == null) {
            handleCorruptedRule(rule);
            return false;
        }

        // check if the event exists in recent events
        return eventService.recentEventExists(trigger.getEvent().getId(), trigger.getDevice().getId());
    }

    public boolean checkStateTrigger(AutomationRule rule) {
        AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId()).orElse(null);
        System.out.println("checking event schedule for rule id " + rule.getId());
        if (trigger == null || trigger.getStateValue() == null) {
            handleCorruptedRule(rule);
            return false;
        }

        StateValue currentState = stateValueRepository.findById(trigger.getStateValue().getId())
                .orElse(null);

        if (currentState == null) {
            handleCorruptedRule(rule);
            return false;
        }

        String actualValue = currentState.getStateValue();
        String expectedValue = trigger.getStateTriggerValue(); // This is the condition value from the trigger

        if (currentState.getState().getType() == State.StateType.RANGE) {
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
                log.warn("Failed to parse numeric values for range automation trigger: {}, {}, for automation rule: {}", actualValue, expectedValue, rule.getName());
                return false;
            }
        } else { // ENUM type, only support equal operator
            return actualValue.equals(expectedValue);
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

        // Convert cooldownDuration from minutes to seconds for comparison
        long cooldownInSeconds = rule.getCooldownDuration() * 60;

        // If the cooldown period has passed, clear the lastExecutedTime
        if (secondsSinceLastExecution >= cooldownInSeconds) {
            rule.setLastExecutedTime(null);
            ruleRepository.save(rule);
            log.debug("Cooldown period expired for rule {}", rule.getName());
            return false; // Not in cooldown anymore
        } else {
            // Still in cooldown period, skip this rule
            log.debug("Rule {} was skipped as it is in cooldown for {} more minutes",
                    rule.getName(), (cooldownInSeconds - secondsSinceLastExecution) / 60);
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
                log.info("Setting cooldown for rule {} to {} minutes", rule.getName(), rule.getCooldownDuration());
            }

            // Save the updated rule with the new lastExecutedTime
            ruleRepository.save(rule);

        } catch (Exception e) {
            log.error("Error executing actions for rule {}: {}", rule.getId(), e.getMessage(), e);
        }
    }

    private void handleCorruptedRule(AutomationRule rule) {
        // Get the rule with creator information properly loaded
        AutomationRule loadedRule = ruleRepository.findById(rule.getId()).orElse(null);

        String email = loadedRule.getCreatedBy().getEmail(); // Assuming there's a createdBy field
        notificationService.sendNotificationToUser(email,
            "Automation Rule Error",
            "Your automation rule '" + loadedRule.getName() + "' was corrupted and has been removed.");

        log.warn("automation rule {} was corrupted and has been removed.", loadedRule.getName());
        unsubscribeTrigger(loadedRule.getId());
        ruleRepository.delete(loadedRule);
    }
}








