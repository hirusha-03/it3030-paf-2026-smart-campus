package com.smart.backend.authentication.service;

import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.entity.Users;

public interface UserService {

    Users registerNewUser(SignupRequest signupRequest);

    void initRoleAndUser();
}
