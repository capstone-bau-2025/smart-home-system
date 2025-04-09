package com.capstonebau2025.centralhub.dto.cloudComm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkUserResponse {
    private boolean success;
    private String message;
    private UserData userData;
    private LocalDateTime linkTime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserData {
        private Long userId;
        private String email;
        private String username;
        // Add any other user fields the hub needs to store
    }
}
