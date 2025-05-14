package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "devices_models")
public class DeviceModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @NotNull
    @Column(unique = true, nullable = false)
    private String model;

    @Enumerated(EnumType.STRING)
    private DeviceModelType type;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean supportStreaming;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "model", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<State> states;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "model", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Command> commands;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "model", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Event> events;

    public enum DeviceModelType {
        LIGHT, SWITCH, CAMERA, SENSOR, DOOR, CURTAIN, FAN, OTHER
    }
}
