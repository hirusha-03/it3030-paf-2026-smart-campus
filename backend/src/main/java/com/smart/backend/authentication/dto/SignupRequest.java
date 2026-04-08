package com.smart.backend.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SignupRequest {


    private String userFirstName;
    private String userLastName;
    private String contactNumber;
    private String userName;
    private String userPassword;
    private String userRole;
}
