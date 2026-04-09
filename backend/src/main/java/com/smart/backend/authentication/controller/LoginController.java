package com.smart.backend.authentication.controller;

import com.smart.backend.authentication.dto.LoginRequest;
import com.smart.backend.authentication.dto.LoginResponse;
import com.smart.backend.authentication.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin
public class LoginController {

    @Autowired
    private JWTService jwtService;

    @PostMapping({"/authentication"})
    public LoginResponse createJWTTokenAndLogin(@RequestBody LoginRequest loginRequest) throws Exception{
        return jwtService.createJWTToken(loginRequest);
    }


}
