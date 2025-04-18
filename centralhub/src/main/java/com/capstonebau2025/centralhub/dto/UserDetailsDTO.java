package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDetailsDTO {
    private Long id;
    private String email;
    private String username;
    private String role;
}
