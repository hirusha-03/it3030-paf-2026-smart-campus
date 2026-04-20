package com.smart.backend.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginResponse {

    private String jwtToken;
    private String userName;
    private String userFirstName;
    private String userLastName;
    private String email;
    private String contactNumber;
    private Set<String> roles;
}