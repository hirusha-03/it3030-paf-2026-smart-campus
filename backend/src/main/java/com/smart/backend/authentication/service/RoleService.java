package com.smart.backend.authentication.service;

import com.smart.backend.authentication.entity.Role;
import org.springframework.stereotype.Service;

public interface RoleService {
    Role createNewRole(Role role);
}
