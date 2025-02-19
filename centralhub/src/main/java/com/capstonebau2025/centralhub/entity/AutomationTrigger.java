package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "automation_triggers")
public class AutomationTrigger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne
    @JoinColumn(name = "automation_rule_id", nullable = false)
    private AutomationRule automationRule;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    //Attribute specific to trigger owned by automation rule with type EVENT, NULL otherwise
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event; // TODO: add bidirectional relation to Event entity

    //Attributes specific to trigger owned by automation rule with type STATUS_VALUE, NULL otherwise
    @ManyToOne
    @JoinColumn(name = "state_value_id")
    private StateValue stateValue; // TODO: add bidirectional relation to StateValue entity

    @Enumerated(EnumType.STRING)
    private TriggerOperator operator;

    private String stateTriggerValue;

    //TODO: make sure operator is only EQUAL if state type is ENUM not RANGE
    public enum TriggerOperator {
        EQUAL, GREATER, LESS, GREATER_OR_EQUAL, LESS_OR_EQUAL
    }

}
