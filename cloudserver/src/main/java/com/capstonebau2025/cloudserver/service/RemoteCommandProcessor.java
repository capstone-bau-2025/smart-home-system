package com.capstonebau2025.cloudserver.service;

import com.capstonebau2025.cloudserver.dto.RemoteCommandMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RemoteCommandProcessor {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public void processCommand(String hubId, RemoteCommandMessage command) {
        try {
            String destination = "/topic/commands/" + hubId;
            log.info("Sending command to hub {}: {}", hubId, command);
            messagingTemplate.convertAndSend(destination, command);
        } catch (Exception e) {
            log.error("Error processing command for hub {}: {}", hubId, e.getMessage(), e);
            throw new RuntimeException("Failed to process command", e);
        }
    }
}
