package com.smart.backend.authentication.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JWTUtil {

    private static final String SECRET_KEY = "8f3d9a7c1b2e4f6d8a0c9e7b5d3f1a2c4e6b8d0f9a7c1e3b5d7f9a2c4e6b8d0f";
    private static final int TOKEN_VALIDITY = 3600*5;

    public String getUsernameFromToken(String token){
        return getClaimFromToken(token, Claims::getSubject);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver){
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = getUsernameFromToken(token);

        return(username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token){
        final Date expiration = getClaimFromToken(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration((new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000)))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
}
