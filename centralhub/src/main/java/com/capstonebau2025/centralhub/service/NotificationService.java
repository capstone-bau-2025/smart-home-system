package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.NotificationDTO;

public class NotificationService {

    public void sendNotification(NotificationDTO notificationDTO) {
        System.out.println("Sending notification: " + notificationDTO.getTitle() + " - " + notificationDTO.getBody());
    }
}
