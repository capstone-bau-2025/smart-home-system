package com.capstonebau2025.centralhub;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;

public class CloudWebSocketClient extends WebSocketClient {
    private static final Logger logger = LoggerFactory.getLogger(CloudWebSocketClient.class);

    public CloudWebSocketClient(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        logger.info("Connected to Cloud Server");
        send("Hello from Central Hub");
    }

    @Override
    public void onMessage(String message) {
        logger.info("Received from Cloud: " + message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        logger.info("Connection closed: " + reason);
    }

    @Override
    public void onError(Exception ex) {
        logger.error("Error: ", ex);
    }
}

