package com.capstonebau2025.centralhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "devices")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private DeviceModel model;

    @NotNull
    @Column(unique = true, nullable = false)
    private Long uid;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DeviceStatus status;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @OneToMany(mappedBy = "device", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<StateValue> stateValues;

    @CreationTimestamp
    @Column(updatable = true)
    private LocalDateTime lastSeen;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum DeviceStatus {
        CONNECTED, DISCONNECTED, NOT_RESPONDING
    }
}
