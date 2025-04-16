package com.capstonebau2025.centralhub.client;

import com.capstonebau2025.centralhub.dto.RemoteCommandMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class WebsocketClient {
    private static final Logger logger = LoggerFactory.getLogger(WebsocketClient.class);

    private final String hubId;
    private final String token;
    private StompSession session;
    private final WebSocketCommandHandler commandHandler;

    public WebsocketClient(String hubId, String token, WebSocketCommandHandler commandHandler) {
        this.hubId = hubId;
        this.token = token;
        this.commandHandler = commandHandler;
    }

    public void connectToCloud(String serverUrl) {
        // Add token to URL for authentication
        String connectionUrl = serverUrl + "?token=" + token;
        logger.info("Connecting with URL: {}", connectionUrl);

        // Setup WebSocket client
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        WebSocketStompClient stompClient = new WebSocketStompClient(new SockJsClient(transports));
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        try {
            // Connect and establish session
            session = stompClient.connectAsync(connectionUrl, new StompSessionHandler() {
                @Override
                public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
                    logger.info("Connected to Cloud Server");

                    // Pass the session to the command handler
                    commandHandler.setStompSession(session);

                    // Subscribe to hub-specific topic
                    session.subscribe("/topic/messages/" + hubId, new StompFrameHandler() {
                        @Override
                        public Type getPayloadType(StompHeaders headers) {
                            return Message.class;
                        }

                        @Override
                        public void handleFrame(StompHeaders headers, Object payload) {
                            Message msg = (Message) payload;
                            logger.info("Received from Cloud: {}", msg.getContent());
                        }
                    });

                    // Subscribe to hub-specific command topic
                    session.subscribe("/topic/commands/" + hubId, new StompFrameHandler() {
                        @Override
                        public Type getPayloadType(StompHeaders headers) {
                            return RemoteCommandMessage.class;
                        }

                        @Override
                        public void handleFrame(StompHeaders headers, Object payload) {
                            RemoteCommandMessage message = (RemoteCommandMessage) payload;
                            logger.info("Received command from Cloud: {}", message);

                            // Forward the message to our command handler
                            commandHandler.processCommand(hubId, message);
                        }
                    });

                    logger.info("Subscribed to /topic/commands/{}", hubId);

                    // Send a test message
                    session.send("/app/message", new Message("Hello from " + hubId, hubId));
                }

                @Override
                public void handleException(StompSession session, StompCommand command,
                                            StompHeaders headers, byte[] payload, Throwable exception) {
                    logger.error("Error: {}", exception.getMessage());
                }

                @Override
                public void handleTransportError(StompSession session, Throwable exception) {
                    logger.error("Transport error: {}", exception.getMessage());
                }

                @Override
                public Type getPayloadType(StompHeaders headers) {
                    return Message.class;
                }

                @Override
                public void handleFrame(StompHeaders headers, Object payload) {
                    // Not used in this implementation
                }
            }).get();

        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    // Message class matching the server-side model
    private static class Message {
        private String content;
        private String sender;

        public Message() {}

        public Message(String content, String sender) {
            this.content = content;
            this.sender = sender;
        }

        public String getContent() {
            return content;
        }

        public String getSender() {
            return sender;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }
    }
}


