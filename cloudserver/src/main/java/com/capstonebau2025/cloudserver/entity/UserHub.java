package com.capstonebau2025.cloudserver.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_hub")
public class UserHub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "hub_id", nullable = false)
    private Hub hub;

    @NotNull
    @Column(name = "role", nullable = false)
    private String role;
}
