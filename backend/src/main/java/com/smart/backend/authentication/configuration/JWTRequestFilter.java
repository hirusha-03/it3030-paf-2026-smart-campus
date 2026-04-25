package com.smart.backend.authentication.configuration;

import com.smart.backend.authentication.service.JWTService;
import com.smart.backend.authentication.service.TokenBlacklistService;
import com.smart.backend.authentication.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);

            // Check if token is blacklisted
            if (tokenBlacklistService.isTokenBlacklisted(jwtToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Token is invalidated. Please login again.\"}");
                return;
            }

            try {
                username = jwtUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get jwt token");
            } catch (ExpiredJwtException e) {
                System.out.println("Jwt Token is expired");
            }

        } else {
            System.out.println("Jwt Token does not start with Bearer");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = jwtService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                // Prefer authorities from token (if present) so tokens issued by auth server carry roles without DB lookup
                java.util.List<String> rolesFromToken = jwtUtil.getRolesFromToken(jwtToken);
                java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities;
                if (rolesFromToken != null && !rolesFromToken.isEmpty()) {
                    authorities = rolesFromToken.stream()
                            .map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority(r.startsWith("ROLE_") ? r.toUpperCase() : "ROLE_" + r.toUpperCase()))
                            .toList();
                } else {
                    authorities = userDetails.getAuthorities();
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
