package com.capstonebau2025.cloudserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(nullable = false)
    private String username;    //notnullable

    @NotNull
    @Column(unique = true, nullable = false)
    private String email;       //notnullable and unique

    @NotNull
    @Column(nullable = false)
    private String password;    //notnullable

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserHub> userHubs;

    private String fcmToken;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public String getUsername() {
        return email; // Use email as the username
    }

    public String getRealUsername() { return username; // Use username as the real username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account never expires
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account is never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials never expire
    }

    @Override
    public boolean isEnabled() {
        return true; // Account is always enabled
    }
}