package com.smart.backend.authentication.controller;

import com.smart.backend.authentication.service.LogoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin
public class LogoutController {

    @Autowired
    private LogoutService logoutService;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        logoutService.logout(authorizationHeader);
        return ResponseEntity.ok("{\"message\": \"Logged out successfully\"}");
    }
}
