package com.capstonebau2025.centralhub.dto;

import com.capstonebau2025.centralhub.entity.Invitation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddUserRequest {
    private String invitation;
    private String email;
    private String cloudToken;
    private String hubSerialNumber;

}
