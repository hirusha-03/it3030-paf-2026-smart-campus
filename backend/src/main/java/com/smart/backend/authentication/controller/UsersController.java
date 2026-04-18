package com.smart.backend.authentication.controller;

import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.dto.UserProfileResponse;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.service.UserService;
import com.smart.backend.authentication.util.StandardResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin
public class UsersController {

    @Autowired
    private UserService userService;

    @PostConstruct
    public void initRoleAndUser(){
        userService.initRoleAndUser();
    }

    @PostMapping("/register-new-user")
    public Users registerNewUser(@RequestBody SignupRequest signupRequest){
        return userService.registerNewUser(signupRequest);
    }

    @GetMapping({"/for-admin"})
    public String forAdmin(){
        return "this url is only accessible to admin";
    }

    @GetMapping({"/for-user"})
    public String forUser(){
        return "this url is only accessible to user";
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {

        return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
    }

}
