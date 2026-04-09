package com.smart.backend.authentication.service;

import com.smart.backend.authentication.dto.LoginRequest;
import com.smart.backend.authentication.dto.LoginResponse;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class JWTService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepo.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getUserPassword(),
                getAuthority(user)
        );
    }

    private Set<SimpleGrantedAuthority> getAuthority(Users user){
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
//        for(Role role: user.getRole()){
//            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));
//        }

        user.getRole().forEach((role -> {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));
        }));

        return authorities;
    }

    public LoginResponse createJWTToken(LoginRequest loginRequest) throws Exception{
        String username = loginRequest.getUsername();
        String userPassword = loginRequest.getUserPassword();

        authenticate(username, userPassword);
        UserDetails userDetails = loadUserByUsername(username);
        String newGeneratedToken = jwtUtil.generateToken(userDetails);
        Users user = userRepo.findByUserName(username).get();

        LoginResponse loginResponse = new LoginResponse(
                user,
                newGeneratedToken
        );

        return loginResponse;
    }

    private void authenticate(String userName, String userPassword) throws Exception {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userName, userPassword));
        }catch(BadCredentialsException e){
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
