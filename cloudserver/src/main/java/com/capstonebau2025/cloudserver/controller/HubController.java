package com.capstonebau2025.cloudserver.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hub")
@RequiredArgsConstructor
public class HubController {

    @PostMapping("/registerHub")
    public ResponseEntity<String> registerHub(@RequestBody String id) {

        /*
         * TODO: Implement hub registration
         * this method should allow a hub to register itself
         * to the cloud server (create hub profile), after hub is registered to the
         * cloud hub should be able to establish websocket connection with the cloud server.
         * this method should be implemented after hub entity is created.
         */

        return ResponseEntity.ok("hub registered");
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
