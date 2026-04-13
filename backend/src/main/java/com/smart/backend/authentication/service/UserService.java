package com.smart.backend.authentication.service;

import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.dto.UserProfileResponse;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.util.StandardResponse;
import org.jspecify.annotations.Nullable;

public interface UserService {

    Users registerNewUser(SignupRequest signupRequest);

    void initRoleAndUser();

    UserProfileResponse getUserProfile(String name);
}
