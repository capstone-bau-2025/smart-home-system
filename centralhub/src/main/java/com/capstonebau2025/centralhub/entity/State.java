package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "states")
public class State {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private DeviceModel model;

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private Integer number; //Unique id relative to device model that owns the state

    @NotNull
    @Column(nullable = false)
    private Boolean isMutable;

    @NotNull
    @Column(nullable = false)
    private StateType type;

    //Attributes specific to state with type RANGE, NULL otherwise
    private Integer maxRange; //inclusive
    private Integer minRange; //inclusive

    //Attribute specific to state with type ENUM, NULL otherwise
    @OneToMany(mappedBy = "state", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StateChoice> choices;

    public enum StateType {
        ENUM, RANGE
    }
}
