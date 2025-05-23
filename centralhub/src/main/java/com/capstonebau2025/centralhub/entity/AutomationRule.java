package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "automation_rules")
public class AutomationRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;

    @NotNull
    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isEnabled;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TriggerType triggerType;

    private String description;

    @NotNull
    @Column(nullable = false)
    private Integer cooldownDuration; // Cooldown duration in seconds

    private LocalTime lastExecutedTime; // Last time the automation was executed

    @OneToOne(mappedBy = "automationRule")
    private AutomationTrigger trigger;

    @OneToMany(mappedBy = "automationRule")
    private List<AutomationAction> actions = new ArrayList<>();

    public enum TriggerType {
        SCHEDULE, EVENT, STATE_UPDATE
    }
}
