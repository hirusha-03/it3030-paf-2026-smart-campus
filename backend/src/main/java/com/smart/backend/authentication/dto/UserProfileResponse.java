package com.smart.backend.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserProfileResponse {

    private int userId;
    private String userName;
    private String userFirstName;
    private String userLastName;
    private String email;
    private String contactNumber;
    private String provider;
    private Set<String> roles;
}
