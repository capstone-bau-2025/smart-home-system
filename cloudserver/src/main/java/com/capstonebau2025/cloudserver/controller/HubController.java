package com.capstonebau2025.cloudserver.controller;


import com.capstonebau2025.cloudserver.entity.Hub;
import com.capstonebau2025.cloudserver.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.WebSocketConnectionManager;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.WebSocketHttpHeaders;
import java.net.URI;
@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {
    private final HubRepository hubRepository;
    @PostMapping("/registerHub")
    public ResponseEntity<String> registerHub(@RequestBody Hub hub) {
        try {
            // Validate the Hub entity
            if (hub.getName() == null || hub.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Hub name is required");
            }

            // Save the Hub entity to the database
            hubRepository.save(hub);

            // Establish WebSocket connection
            WebSocketClient client = new StandardWebSocketClient();
            WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
            URI uri = new URI("ws://cloudserver/websocket");
            WebSocketConnectionManager manager = new WebSocketConnectionManager(client, new TextWebSocketHandler() {
                @Override
                public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                    session.sendMessage(new TextMessage("Hub registered: " + hub.getName()));
                }
            }, uri.toString());
            manager.setHeaders(headers);
            manager.start();

            // Log the registration
            System.out.println("Hub registered: " + hub.getName());

            return ResponseEntity.ok("Hub registered and WebSocket connection established");
        } catch (Exception e) {
            // Handle errors
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error registering hub: " + e.getMessage());
        }
    }

    @PostMapping("/validateUser")
    public ResponseEntity<String> validateUser(@RequestBody String token) {

       /*
        * TODO: Implement validating user
        * this method should allow a hub to make sure that a user is valid by its token,
        * can be the default user JWT token or the special token (yet to be decided),
        * this method should be used in hub setup & adding new user to the hub.
        */

        return ResponseEntity.ok("User is valid");
    }

    @PostMapping("/linkUser")
    public ResponseEntity<String> linkUser(@RequestBody String token) {

       /*
        * TODO: Implement linking user
        * this method should allow a hub to link a user to it by its token,
        * can be the default user JWT token or the special token (yet to be decided),
        * this method should be used in hub setup & adding new user to the hub.
        */

        return ResponseEntity.ok("User is linked");
    }
}




