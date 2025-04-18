package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDetailsDTO {
    private Long id;
    private String email;
    private String username;
    private String role;
} // TODO: not used as response of hub is returned directly as Object
