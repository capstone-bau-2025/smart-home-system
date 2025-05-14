package com.capstonebau2025.cloudserver.controller;

import com.capstonebau2025.cloudserver.dto.UserDetails;
import com.capstonebau2025.cloudserver.entity.User;
import com.capstonebau2025.cloudserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/user-details")
    public ResponseEntity<UserDetails> getUserDetails(@AuthenticationPrincipal User user) {


        UserDetails userDetails = userService.getUserDetails(user.getEmail());
        return ResponseEntity.ok(userDetails);
    }
}
