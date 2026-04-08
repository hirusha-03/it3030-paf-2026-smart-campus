package com.smart.backend.authentication.controller;

import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
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

}
