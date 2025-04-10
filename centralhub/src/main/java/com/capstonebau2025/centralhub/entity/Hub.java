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
    private String serialNumber;//like gmail it has unique id and notnullable

    @Column(name="hub_key")
    private String key;   //password of hub taken from hub on registration

    private String location;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        SETUP,
        RUNNING,
        INITIALIZING,
        ERROR
    }
}
