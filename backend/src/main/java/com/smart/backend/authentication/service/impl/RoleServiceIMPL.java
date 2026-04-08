package com.smart.backend.authentication.service.impl;

import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.repo.RoleRepo;
import com.smart.backend.authentication.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceIMPL implements RoleService {

    @Autowired
    private RoleRepo roleRepo;

    @Override
    public Role createNewRole(Role role) {

        return roleRepo.save(role);
    }
}
