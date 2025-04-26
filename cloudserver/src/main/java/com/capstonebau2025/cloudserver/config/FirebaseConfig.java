package com.capstonebau2025.cloudserver.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() {
        try {
            FileInputStream serviceAccount = new FileInputStream("cloudserver/src/main/resources/firebase/smart-home-system-notification-firebase-adminsdk.json");

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

        } catch (Exception e) {
            log.error("Error initializing Firebase: ", e);
        }
    }
}
