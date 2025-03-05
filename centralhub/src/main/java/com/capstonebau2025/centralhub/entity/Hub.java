package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hubs")
public class Hub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @NotNull
    @Column(unique = true, nullable = false)
    private Long serialNumber;//like gmail it has unique id and notnullable

    @NotNull
    @Column(nullable = false)
    private Long key;   //password notnullable

    private String location;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        SETUP,
        RUNNING,
        ERROR
    }
}
