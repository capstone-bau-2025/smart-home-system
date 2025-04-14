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
            // Save rule
            AutomationRule savedRule = ruleRepository.save(rule);

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
            AutomationRule rule = ruleRepository.findById(ruleId)
                    .orElseThrow(() -> new EntityNotFoundException("Rule not found"));

            action.setAutomationRule(rule);
            return actionRepository.save(action);
        }
    }

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

