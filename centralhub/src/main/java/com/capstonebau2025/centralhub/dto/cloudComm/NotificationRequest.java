package com.capstonebau2025.centralhub.dto.cloudComm;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationRequest {
    private String token;
    private String email;
    private String title;
    private String body;
}
