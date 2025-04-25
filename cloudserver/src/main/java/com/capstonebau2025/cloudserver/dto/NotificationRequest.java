package com.capstonebau2025.cloudserver.dto;

import lombok.Data;

@Data
public class NotificationRequest {
    private String token;
    private String fcmToken;
    private String title;
    private String body;
}
