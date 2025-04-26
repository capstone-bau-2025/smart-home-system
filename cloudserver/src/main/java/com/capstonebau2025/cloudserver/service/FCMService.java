package com.capstonebau2025.cloudserver.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FCMService {

    private final UserService userService;

    public String sendNotification(String email, String title, String body) throws FirebaseMessagingException {
        String fcmToken = userService.getUserFcmToken(email);

        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setToken(fcmToken)
                .setNotification(notification)
                .build();

        return FirebaseMessaging.getInstance().send(message);
    }
}
