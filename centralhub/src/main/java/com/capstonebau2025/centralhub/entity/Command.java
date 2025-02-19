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
@Table(name = "commands")
public class Command {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private DeviceModel model;

    @NotNull
    @Column(nullable = false)
    private Integer number; //Unique id relative to device model that owns the command

    @NotNull
    @Column(nullable = false)
    private String name;
    private String description;
}
