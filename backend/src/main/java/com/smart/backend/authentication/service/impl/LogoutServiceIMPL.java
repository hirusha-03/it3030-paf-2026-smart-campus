package com.smart.backend.authentication.service.impl;

import com.smart.backend.authentication.service.LogoutService;
import com.smart.backend.authentication.service.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogoutServiceIMPL implements LogoutService {

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    public void logout(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            // Blacklist the token
            tokenBlacklistService.blacklistToken(token);
        }
    }

}
