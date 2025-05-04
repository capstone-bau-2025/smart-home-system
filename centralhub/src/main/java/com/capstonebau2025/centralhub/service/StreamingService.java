package com.capstonebau2025.centralhub.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class StreamingService {

    @Value("${cloud.server.url}")
    private String cloudUrl;
    private final SurveillanceService surveillanceService;

    /**
     * Streams camera feed to the cloud server
     */
    public void streamCameraToCloud(Long userId, Long cameraId, String sessionId) {
        log.info("Starting camera stream to cloud for camera {} with session {}", cameraId, sessionId);

        HttpURLConnection connection = null;
        try {
            String path = cloudUrl + "/api/streams/receive/" + sessionId;
            URL url = new URL(path);
            connection = (HttpURLConnection) url.openConnection();

            // Set connection properties with improved timeouts
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
            connection.setChunkedStreamingMode(16384);
            connection.setConnectTimeout(30000); // 30 second connect timeout
            connection.setReadTimeout(60000);    // 60 second read timeout

            try (OutputStream outputStream = connection.getOutputStream()) {
                surveillanceService.streamCameraFeedToOutput(userId, cameraId, outputStream);
            }

            // Check response
            int responseCode = connection.getResponseCode();
            log.info("Cloud streaming completed with response code: {}", responseCode);

        } catch (Exception e) {
            log.error("Error streaming camera feed to cloud: {}", e.getMessage(), e);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
}