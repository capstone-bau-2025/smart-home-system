package com.capstonebau2025.centralhub.dto.localRequests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String invitation;
    private String email;
    private String cloudToken;
    private String hubSerialNumber;

}
