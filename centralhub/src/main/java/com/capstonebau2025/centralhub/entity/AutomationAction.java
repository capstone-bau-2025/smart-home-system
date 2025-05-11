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
@Table(name = "automation_actions")
public class AutomationAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "automation_rule_id", nullable = false)
    private AutomationRule automationRule;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @NotNull
    @Column(nullable = false)
    private ActionType type;

    // only if ActionType is COMMAND
    @ManyToOne
    @JoinColumn(name = "command_id")
    private Command command;

    // only if ActionType is STATE_UPDATE
    @ManyToOne
    @JoinColumn(name = "states_value_id")
    private StateValue stateValue;

    @Column(name = "action_value")
    private String value;

    public enum ActionType {
        COMMAND, STATE_UPDATE
    }
}
