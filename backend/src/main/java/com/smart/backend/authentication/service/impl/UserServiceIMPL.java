package com.smart.backend.authentication.service.impl;

import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.RoleRepo;
import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceIMPL implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;


    @Override
    public Users registerNewUser(SignupRequest signupRequest) {

        if(!userRepo.existsByUserName(signupRequest.getUserName())){
            Users user = new Users();
            user.setUserName(signupRequest.getUserName());
            user.setUserPassword(signupRequest.getUserPassword());
            user.setUserFirstName(signupRequest.getUserFirstName());
            user.setUserLastName(signupRequest.getUserLastName());
            user.setContactNumber(signupRequest.getContactNumber());

            Set<Role> userRoles = new HashSet<>();

            String requestedRole = signupRequest.getUserRole();
            Role role = roleRepo.findByRoleName(requestedRole); // ← fetch from DB

            if (role == null) {
                throw new RuntimeException("No role found: " + requestedRole);
            }

            userRoles.add(role);
            user.setRole(userRoles);
            return userRepo.save(user);
        }
        throw new RuntimeException("Already Registered User");
    }

    @Override
    public void initRoleAndUser() {
        Role adminRole = new Role();
        if (!roleRepo.existsByRoleName("Admin")) {
            adminRole.setRoleName("Admin");
            adminRole.setRoleDescription("Admin role");
            roleRepo.save(adminRole);
        }

        Role userRole = new Role();
        if (!roleRepo.existsByRoleName("User")) {
            userRole.setRoleName("User");
            userRole.setRoleDescription("User role");
            roleRepo.save(userRole);
        }

        if (!userRepo.existsByUserName("admin123")) {
            Users user = new Users();
            user.setUserName("admin123");
            user.setUserPassword("admin@123");
            user.setUserFirstName("Tashen");
            user.setUserLastName("Chamika");
            user.setContactNumber("01236547");

            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);

            user.setRole(adminRoles);
            userRepo.save(user);
        }

        if (!userRepo.existsByUserName("user123")) {
            Users user = new Users();
            user.setUserName("user123");
            user.setUserPassword("user@123");
            user.setUserFirstName("Kamal");
            user.setUserLastName("Perera");
            user.setContactNumber("02365478");

            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);

            user.setRole(userRoles);
            userRepo.save(user);
        }
    }
}

