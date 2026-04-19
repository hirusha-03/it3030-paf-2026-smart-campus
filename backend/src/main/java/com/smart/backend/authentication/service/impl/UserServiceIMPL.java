package com.smart.backend.authentication.service.impl;

import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.dto.UserProfileResponse;
import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.RoleRepo;
import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceIMPL implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public Users registerNewUser(SignupRequest signupRequest) {
        if(!userRepo.existsByUserName(signupRequest.getUserName())){
            Users user = new Users();
            user.setEmail(signupRequest.getEmail());
            user.setUserName(signupRequest.getUserName());
            user.setUserPassword(getEncodedPassword(signupRequest.getUserPassword()));
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
            user.setEmail("admin@gmail.com");
            user.setUserPassword(getEncodedPassword("admin@123"));
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
            user.setEmail("user@gmail.com");
            user.setUserPassword(getEncodedPassword("user@123"));
            user.setUserFirstName("Kamal");
            user.setUserLastName("Perera");
            user.setContactNumber("02365478");

            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);

            user.setRole(userRoles);
            userRepo.save(user);
        }
    }

    @Override
    public UserProfileResponse getUserProfile(String username) {
        Users user = userRepo.findByUserName(username)
                .or(() -> userRepo.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Set<String> roles = user.getRole() != null
                ? user.getRole().stream()
                .map(role -> role.getRoleName())
                .collect(Collectors.toSet())
                : Set.of("USER");

        return new UserProfileResponse(
                user.getUserId(),
                user.getUserName(),
                user.getUserFirstName(),
                user.getUserLastName(),
                user.getEmail(),
                user.getContactNumber(),
                roles
        );

    }

    public String getEncodedPassword(String password){
        return passwordEncoder.encode(password);
    }

}
