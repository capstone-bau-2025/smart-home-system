package com.capstonebau2025.centralhub.service.automation;

import com.capstonebau2025.centralhub.entity.AutomationAction;
import com.capstonebau2025.centralhub.entity.AutomationRule;
import com.capstonebau2025.centralhub.entity.AutomationTrigger;
import com.capstonebau2025.centralhub.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        /**
         * Create a full automation rule with its trigger and actions
         */
        @Transactional
        public AutomationRule createAutomation(AutomationRule rule, AutomationTrigger trigger, List<AutomationAction> actions) {
            /*
            * TODO: (note from hamza) create a new dto that should be the request for createAutomation it should contain
            *  the data we need to create automation including data for automation rule, trigger, and list of actions
            *  copy data from these three entities that we need and add them to this dto.
            *  after that you should use builder to create the entities in this method.
            *
            * */

//            AutomationRuleBuilder ruleBuilder = AutomationRule.builder()
//                    .name(request.getName)
//                    .description();
//
//            if rule is schedule
//            rule.scheduledTime(request.scheduleTime)
//            else type is not schedule
//            AutomationTrigger
//
//            // Save rule
            AutomationRule savedRule = ruleRepository.save(rule); //ruleBuilder.build()

            // Attach rule to trigger
            trigger.setAutomationRule(savedRule);
            triggerRepository.save(trigger);

            // Attach rule to actions
            for (AutomationAction action : actions) {
                action.setAutomationRule(savedRule);
                actionRepository.save(action);
            }

            // Subscribe for execution
            automationExecService.subscribeTrigger(savedRule.getId());

            return savedRule;
        }

        /**
         * Update the name of an automation rule
         */
        @Transactional
        public AutomationRule updateAutomationRuleName(Long ruleId, String newName) {
            AutomationRule rule = ruleRepository.findById(ruleId)
                    .orElseThrow(() -> new EntityNotFoundException("Rule not found"));
            rule.setName(newName);
            return ruleRepository.save(rule);
        }

        /**
         * Update the trigger of a rule (by replacing the old one)
         */
        @Transactional
        public AutomationTrigger updateAutomationTrigger(Long ruleId, AutomationTrigger newTrigger) {
            /*
            * TODO: (note from hamza) similar to the note above, all methods in this class should not take ready entities
            *  they should take a dto with required information to create the entity. so here you should
            *  replace AutomationTrigger with a new dto that contains ruleId and the data we need to create the trigger
            *
            * */
            AutomationRule rule = ruleRepository.findById(ruleId)
                    .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

            AutomationTrigger oldTrigger = triggerRepository.findByAutomationRuleId(ruleId)
                    .orElseThrow(() -> new EntityNotFoundException("Trigger not found"));

            triggerRepository.delete(oldTrigger);
            newTrigger.setAutomationRule(rule);
            AutomationTrigger saved = triggerRepository.save(newTrigger);

            automationExecService.resubscribeTrigger(ruleId);

            return saved;
        }

        /**
         * Remove an action from a rule
         */
        @Transactional
        public void removeAutomationAction(Long actionId) {
            AutomationAction action = actionRepository.findById(actionId)
                    .orElseThrow(() -> new EntityNotFoundException("Action not found"));
            actionRepository.delete(action);
        }

        /**
         * Add a new action to a rule
         */
        @Transactional
        public AutomationAction addAutomationAction(Long ruleId, AutomationAction action) {
            /*
            * TODO: (note from hamza) again replace AutomationAction parameter with a new dto that contains the data needed.
            * */
            AutomationRule rule = ruleRepository.findById(ruleId)
                    .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

            action.setAutomationRule(rule);
            return actionRepository.save(action);
        }
    }

    // TODO: (note from hamza) add another method for turning automation on or off

    /*
    * method for creating an automation including rule, trigger, and their actions,
    * and call automationExecService to subscribe for events and state changes
    *
    * method for updating automation rule name
    *
    * method for updating automation trigger
    *
    * method for removing an automation action for an automation
    *
    * method for adding an automation action for an automation
    *
    * */

