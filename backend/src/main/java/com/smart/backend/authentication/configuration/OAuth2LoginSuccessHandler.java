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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    // Frontend URL
    private static final String FRONTEND_URL = "http://localhost:5173";

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
        String email     = oauth2User.getAttribute("email");
        String firstName = oauth2User.getAttribute("given_name");
        String lastName  = oauth2User.getAttribute("family_name");

        String mode = (String) request.getSession().getAttribute("mode");
        request.getSession().removeAttribute("mode");

        Optional<Users> existingUser = userRepo.findByEmail(email);

        //  SIGNUP flow
        if ("signup".equalsIgnoreCase(mode)) {

            if (existingUser.isPresent()) {
                // Email already exists — redirect with error
                response.sendRedirect(
                        FRONTEND_URL + "/signup?error=EMAIL_EXISTS"
                );
                return;
            }

            Users newUser = buildNewUser(email, firstName, lastName);
            userRepo.save(newUser);

            String token = generateToken(newUser);
            response.sendRedirect(buildRedirectUrl(token, newUser));

            //  SIGNIN flow
        } else if ("signin".equalsIgnoreCase(mode)) {

            if (existingUser.isEmpty()) {
                // No account — redirect with error
                response.sendRedirect(
                        FRONTEND_URL + "/signin?error=NO_ACCOUNT"
                );
                return;
            }

            Users user  = existingUser.get();
            String token = generateToken(user);
            response.sendRedirect(buildRedirectUrl(token, user));

            //  No mode — fallback
        } else {
            Users user = existingUser.orElseGet(() -> {
                Users newUser = buildNewUser(email, firstName, lastName);
                return userRepo.save(newUser);
            });

            String token = generateToken(user);
            response.sendRedirect(buildRedirectUrl(token, user));
        }
    }

    //  Build redirect URL with all user details as query params
    private String buildRedirectUrl(String token, Users user) throws IOException {
        String roleName = user.getRole() != null && !user.getRole().isEmpty()
                ? user.getRole().iterator().next().getRoleName()
                : "User";

        return FRONTEND_URL + "/oauth2/callback" +
                "?token="        + encode(token) +
                "&userName="     + encode(safe(user.getUserName())) +
                "&userFirstName=" + encode(safe(user.getUserFirstName())) +
                "&userLastName="  + encode(safe(user.getUserLastName())) +
                "&email="         + encode(safe(user.getEmail())) +
                "&contactNumber=" + encode(safe(user.getContactNumber())) +
                "&role="          + encode(roleName);
    }

    //  Build new user entity
    private Users buildNewUser(String email, String firstName, String lastName) {
        Users newUser = new Users();
        newUser.setEmail(email);
        newUser.setUserName(email);
        newUser.setUserFirstName(firstName);
        newUser.setUserLastName(lastName);
        newUser.setUserPassword("");

        Role userRole = roleRepo.findByRoleName("User");
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(userRole);
        newUser.setRole(userRoles);

        return newUser;
    }

    //  Generate JWT token
    private String generateToken(Users user) {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getUserPassword() != null ? user.getUserPassword() : "",
                Set.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        return jwtUtil.generateToken(userDetails);
    }

    //  URL encode helper
    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    //  Null safe helper
    private String safe(String value) {
        return value != null ? value : "";
    }
}