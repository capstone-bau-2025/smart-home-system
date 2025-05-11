package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.entity.*;
import com.capstonebau2025.centralhub.repository.*;
import com.capstonebau2025.centralhub.service.device.CommandService;
import jakarta.persistence.EntityNotFoundException;
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

    private final Map<Long, AutomationRule> activeRules = new ConcurrentHashMap<>();
    private final Map<Long, Long> recentEvents = new ConcurrentHashMap<>();    /**     * Subscribe for trigger monitoring (event/state/time) for a given rule
     */

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
                //shouldn't the rule have trigger id as trigger could be the same but can be from different devices
                AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId()).orElse(null);
                if (trigger == null) continue;

                if (rule.getCooldownDuration() != 0 ) continue;

                boolean shouldExecute = switch (rule.getTriggerType()) {
                    case SCHEDULE -> checkScheduledTrigger(trigger);
                    case EVENT -> checkEventTrigger(trigger);
                    case STATUS_VALUE -> checkStateTrigger(trigger);
                };

                if (shouldExecute) {
                    log.info("Trigger met for rule: {}", rule.getName());
                    //executeActions(rule);
                }
            } catch (Exception ex) {
                log.error("Error processing rule {}: {}", rule.getId(), ex.getMessage());
            }
        }
    }

    public boolean checkScheduledTrigger(AutomationTrigger trigger) {
        if (trigger.getAutomationRule().getScheduledTime() == null) return false;

        LocalTime now = LocalTime.now();
        LocalTime scheduledTime = trigger.getAutomationRule().getScheduledTime();

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

    //Layer 3
//    private void executeActions(AutomationRule rule) {
//        try {
//            /*
//             * TODO: (note from hamza) there is some problems in Action entity i will fix it and inform you to continue
//             *  executeActions method, leave to the end.
//             * */
//            // Get all actions for this rule
//            List<AutomationAction> actions = actionRepository.findByAutomationRuleId((rule.getId()));
//
//            if (actions.isEmpty()) {
//                log.warn("No actions found for rule: {}", rule.getName());
//                return;
//            }
//
//            log.info("Executing {} actions for rule: {}", actions.size(), rule.getName());
//
//            // Execute each action
//            for (AutomationAction action : actions) {
//                try {
//                    boolean success = commandService.executeCommand(  // Using the correct field name
//                            action.getDevice().getId(),
//                            action.getCommand().getId()
//                    );
//
//                    if (success) {
//                        log.info("Successfully executed action {} for rule {}",
//                                action.getId(), rule.getName());
//                    } else {
//                        log.warn("Failed to execute action {} for rule {}",
//                                action.getId(), rule.getName());
//                    }
//                } catch (Exception e) {
//                    log.error("Error executing action {}: {}", action.getId(), e.getMessage(), e);
//                }
//            }
//
//            // Update the last executed timestamp for the rule
//            rule.setLastExecutedTime(LocalDateTime.now().toLocalTime());
//            ruleRepository.save(rule);
//
//        } catch (Exception e) {
//            log.error("Error executing actions for rule {}: {}", rule.getId(), e.getMessage(), e);
//
//        }

    //}
}


/*
 * method for subscribing for events and state changes
 *
 * method for executing actions if if event, state change, or time is triggered,
 * it should be implemented every second or minute
 * */
//1st layer: layer of methods that is used by user with controllers make sure to validate
//2nd layer: will execute the automation actions
// make a merthod to tell me an event happened add event , will create a list and add all events added in memory
//will create cool down and last executed attributes in automation rule
//update trigger (state) pull from databse and compare between stateValue and triggerStateValue
//if state is enum it should be equal





