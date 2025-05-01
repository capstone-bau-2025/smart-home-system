
package com.capstonebau2025.cloudserver.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.capstonebau2025.cloudserver.model.Message;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/message")
    public void handleMessage(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        String hubId = (String) headerAccessor.getSessionAttributes().get("hubId");
        System.out.println("Received from Hub " + hubId + ": " + message.getContent());

        messagingTemplate.convertAndSend("/topic/messages/" + hubId,
                new Message("Response to " + message.getContent(), "Cloud"));
    }
}

