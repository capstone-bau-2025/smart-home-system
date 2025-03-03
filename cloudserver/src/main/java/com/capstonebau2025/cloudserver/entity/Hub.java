package com.capstonebau2025.cloudserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;


import java.util.Set;

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

    @NotNull
    @Column(unique = true, nullable = false)
    private Long serialNumber;//like gmail it has unique id and notnullable

    @NotNull
    @Column(nullable = false)
    private Long key;   //password notnullable

    private String location;




    @OneToMany(mappedBy = "hub_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserHub> userHubs;
}
