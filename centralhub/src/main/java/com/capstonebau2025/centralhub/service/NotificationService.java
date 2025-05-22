package com.capstonebau2025.centralhub.service;

import com.capstonebau2025.centralhub.client.CloudClient;
import com.capstonebau2025.centralhub.entity.Device;
import com.capstonebau2025.centralhub.entity.Permission;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final CloudClient cloudClient;

    @Transactional
    public void sendDeviceNotification(Device device, String title, String body) {
//        device.getArea().getPermissions().stream()
//                .map(Permission::getUser)
//                .forEach(u -> cloudClient.sendNotification(u.getEmail(), title, body));
    }

    public void sendNotificationToUser(String email, String title, String body) {
//        cloudClient.sendNotification(email, title, body);
    }
}
