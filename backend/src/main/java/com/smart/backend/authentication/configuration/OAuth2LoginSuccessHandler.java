package com.smart.backend.authentication.configuration;

import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.RoleRepo;
import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name  = oauth2User.getAttribute("name");

        // Retrieve mode from session
        String mode = (String) request.getSession().getAttribute("mode");
        request.getSession().removeAttribute("mode"); // clean up

        Optional<Users> existingUser = userRepo.findByEmail(email);

        response.setContentType("application/json");

        // SIGNUP flow
        if ("signup".equalsIgnoreCase(mode)) {

            if (existingUser.isPresent()) {
                // Email already in DB — block signup
                response.setStatus(HttpServletResponse.SC_CONFLICT); // 409
                response.getWriter().write(
                        "{\"error\": \"Email already registered. Please Sign In instead.\"}"
                );
                return;
            }

            // New user — register and return JWT
            Users newUser = new Users();
            newUser.setEmail(email);
            newUser.setUserName(email);
            newUser.setUserFirstName(name);
            newUser.setUserPassword("");
            Role userRole = roleRepo.findByRoleName("User");
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);
            newUser.setRole(userRoles);
            userRepo.save(newUser);

            String token = generateToken(newUser);
            response.setStatus(HttpServletResponse.SC_CREATED); // 201
            response.getWriter().write(
                    "{\"message\": \"Signup successful\", \"token\": \"" + token + "\"}"
            );

            // SIGNIN flow
        } else if ("signin".equalsIgnoreCase(mode)) {

            if (existingUser.isEmpty()) {
                // Email not in DB — block signin
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
                response.getWriter().write(
                        "{\"error\": \"No account found. Please Sign Up first.\"}"
                );
                return;
            }

            // Existing user — return JWT
            String token = generateToken(existingUser.get());
            response.setStatus(HttpServletResponse.SC_OK); // 200
            response.getWriter().write(
                    "{\"message\": \"Signin successful\", \"token\": \"" + token + "\"}"
            );

            // No mode provided
        } else {
            Users user = existingUser.orElseGet(() -> {
                Users newUser = new Users();
                newUser.setEmail(email);
                newUser.setUserName(email);
                newUser.setUserFirstName(name);
                newUser.setUserPassword("");
                Role userRole = roleRepo.findByRoleName("User");
                Set<Role> userRoles = new HashSet<>();
                userRoles.add(userRole);
                newUser.setRole(userRoles);
                return userRepo.save(newUser);
            });

            String token = generateToken(user);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(
                    "{\"token\": \"" + token + "\"}"
            );
        }
    }

    private String generateToken(Users user) {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getUserPassword(),
                Set.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        return jwtUtil.generateToken(userDetails);
    }
}
