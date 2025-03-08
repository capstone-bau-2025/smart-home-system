package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "model_id", nullable = false)
    private DeviceModel model;

    @NotNull
    @Column(nullable = false)
    private Integer number; //Unique id relative to device model that owns the event

    @NotNull
    @Column(nullable = false)
    private String name;
    private String description;
}
