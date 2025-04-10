package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.dto.NotificationDTO;
import com.capstonebau2025.centralhub.entity.Device;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendNotification(Device device, NotificationDTO notificationDTO) {
        // only send to users with permission to that device
//        System.out.println("Sending notification: " + notificationDTO.getTitle() + " - " + notificationDTO.getBody());
    }
}
