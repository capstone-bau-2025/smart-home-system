package com.capstonebau2025.centralhub.dto.cloudComm;

import lombok.Data;

@Data
public class UnlinkUserRequest {
    private String token;
    private String email;
}
