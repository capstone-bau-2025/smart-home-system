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
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class WebsocketClient {
    private static final Logger logger = LoggerFactory.getLogger(WebsocketClient.class);
    private static final int RECONNECT_DELAY_SECONDS = 5;

    private final String hubId;
    private final String token;
    private StompSession session;
    private final WebSocketCommandHandler commandHandler;
    private String serverUrl;
    private final AtomicBoolean isConnected = new AtomicBoolean(false);
    private final AtomicBoolean reconnecting = new AtomicBoolean(false);
    private final ScheduledExecutorService reconnectExecutor = Executors.newSingleThreadScheduledExecutor();
    private WebSocketStompClient stompClient;

    public WebsocketClient(String hubId, String token, WebSocketCommandHandler commandHandler) {
        this.hubId = hubId;
        this.token = token;
        this.commandHandler = commandHandler;

        // Initialize WebSocket client
        List<Transport> transports = new ArrayList<>();
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        this.stompClient = new WebSocketStompClient(new SockJsClient(transports));
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    public void connectToCloud(String serverUrl) {
        this.serverUrl = serverUrl;
        connect();
    }

    private void connect() {
        if (reconnecting.get()) {
            return;
        }

        reconnecting.set(true);

        // Add token to URL for authentication
        String connectionUrl = serverUrl + "?token=" + token;
        logger.info("Connecting with URL: {}", connectionUrl);

        try {
            // Connect and establish session
            session = stompClient.connectAsync(connectionUrl, new ReconnectingStompSessionHandler()).get();
            reconnecting.set(false);
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Connection failed: {}", e.getMessage());
            scheduleReconnect();
        }
    }

    private void scheduleReconnect() {
        logger.info("Scheduling reconnection attempt in {} seconds", RECONNECT_DELAY_SECONDS);
        reconnectExecutor.schedule(() -> {
            reconnecting.set(false);
            connect();
        }, RECONNECT_DELAY_SECONDS, TimeUnit.SECONDS);
    }

    public void disconnect() {
        if (session != null && session.isConnected()) {
            session.disconnect();
        }
        reconnectExecutor.shutdownNow();
        isConnected.set(false);
    }

    private class ReconnectingStompSessionHandler extends StompSessionHandlerAdapter {
        @Override
        public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
            logger.info("Connected to Cloud Server");
            isConnected.set(true);
            reconnecting.set(false);

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
            logger.error("Error in STOMP session: {}", exception.getMessage());
        }

        @Override
        public void handleTransportError(StompSession session, Throwable exception) {
            logger.error("Transport error: {}", exception.getMessage());
            isConnected.set(false);

            if (!reconnecting.get()) {
                scheduleReconnect();
            }
        }

        @Override
        public Type getPayloadType(StompHeaders headers) {
            return Message.class;
        }

        @Override
        public void handleFrame(StompHeaders headers, Object payload) {
            // Not used in this implementation
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


