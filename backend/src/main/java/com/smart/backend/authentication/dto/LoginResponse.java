package com.smart.backend.authentication.dto;

import com.smart.backend.authentication.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginResponse {

    private Users user;
    private String JwtToken;
}
