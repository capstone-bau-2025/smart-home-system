package com.capstonebau2025.cloudserver.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserValidationResponse {
    private boolean valid;
    private String message;
    private UserInfo userInfo;

    @Data
    @Builder
    public static class UserInfo {
        private String email;
        private String username;
        // Add other user fields you want to expose
    }
}
