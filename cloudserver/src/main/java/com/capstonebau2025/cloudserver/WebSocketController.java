
package com.capstonebau2025.cloudserver;

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




//package com.capstonebau2025.cloudserver;
//
//import org.springframework.web.socket.*;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//
//@Component
//public class CloudWebSocketHandler extends TextWebSocketHandler {
//    private static final Logger logger = LoggerFactory.getLogger(CloudWebSocketHandler.class);
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) {
//        logger.info("Hub connected: " + session.getId());
//    }
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
//        logger.info("Received from Hub: " + message.getPayload());
//        session.sendMessage(new TextMessage("Message received: " + message.getPayload()));
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
//        logger.info("Hub disconnected: " + session.getId());
//    }
//}
