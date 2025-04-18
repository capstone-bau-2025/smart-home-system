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

    /**
     * Re-subscribe after updating a rule/trigger
     */
    public void resubscribeTrigger(Long ruleId) {
        activeRules.remove(ruleId);
        subscribeTrigger(ruleId);
    }

    /**
     * Main method executed every minute/second to evaluate triggers and execute actions
     *make name automation loop
     *are we specifying which device id did this trigger
     */
    @Scheduled(fixedRate = 60_000) // every minute
    @Transactional
    public void automationLoop() {
        for (AutomationRule rule : activeRules.values()) {
            try {
                AutomationTrigger trigger = triggerRepository.findByAutomationRuleId(rule.getId()).orElse(null);
                if (trigger == null) continue;

                // TODO: (note from hamza) check the cooldown duration here, if it is in cooldown "contine"

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
                log.error("Error processing rule {}: {}", rule.getId(), ex.getMessage());
            }
        }
    }

    public boolean checkScheduledTrigger(AutomationTrigger trigger) {
        if (trigger.getAutomationRule().getScheduledTime() == null) return false;

        LocalTime now = LocalTime.now().withSecond(0);
        LocalTime scheduledTime = trigger.getAutomationRule().getScheduledTime();

        // Check if current time matches scheduled time exactly or is ±1 minute

        /*
        * TODO: (note from hamza) checking schedule equality should be in range way,
        *  for exaple you it should be something like that ( now-60 < scheduledTime && scheduledTime < now+60 )
        *  because the current method compare only on minutes so if the different
        *  between now and scheduledTime is one second it will resolve to false
        * */
        return scheduledTime.equals(now) ||
                scheduledTime.equals(now.plusMinutes(1)) ||
                scheduledTime.equals(now.minusMinutes(1));
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

    public void addEvent(long id) {
        // Find the event from the repository
        Event event = eventRepository.findById(id)
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

    /**
     * Executes all actions for a rule
     */
    //Layer 3 
    private void executeActions(AutomationRule rule) {
        try {
            /*
            * TODO: (note from hamza) there is some problems in Action entity i will fix it and inform you to continue
            *  executeActions method, leave to the end.
            * */
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
                    boolean success = commandService.executeCommand(  // Using the correct field name
                        action.getDevice().getId(), 
                        action.getCommand().getId()
                    );
                    
                    if (success) {
                        log.info("Successfully executed action {} for rule {}", 
                                action.getId(), rule.getName());
                    } else {
                        log.warn("Failed to execute action {} for rule {}", 
                                action.getId(), rule.getName());
                    }
                } catch (Exception e) {
                    log.error("Error executing action {}: {}", action.getId(), e.getMessage(), e);
                }
            }
            
            // Update the last executed timestamp for the rule
            rule.setLastExecutedTime(LocalDateTime.now().toLocalTime());
            ruleRepository.save(rule);
            
        } catch (Exception e) {
            log.error("Error executing actions for rule {}: {}", rule.getId(), e.getMessage(), e);

    }

    }
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



