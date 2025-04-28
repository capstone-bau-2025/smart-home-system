package com.capstonebau2025.centralhub.dto.cloudComm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkUserRequest {
    private String token;
    private String cloudToken;
    private String hubSerialNumber;
    private String email;
    private String role;
}
