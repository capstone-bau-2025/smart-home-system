package com.capstonebau2025.centralhub.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationDTO {
    private String title;
    private String body;
}
