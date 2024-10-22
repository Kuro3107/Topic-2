package com.example.SWP_Project_BackEnd.Dto;

import com.example.SWP_Project_BackEnd.Entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component

public class JwtProvider {

    private final String SECRET_KEY = "AIzaSyDnfEcbABWlludlGaolhm-Q-CSUrx1lP3Q"; // Change to a secure key
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

    // Generate a JWT token
    public String generateToken(Optional<Account> account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", account.get().getEmail());
        claims.put("role", account.get().getRoleId());
        return createToken(claims, account.get().getEmail());
    }

    // Create the JWT token with claims
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate the token
    public boolean validateToken(String token, String userEmail) {
        final String email = extractEmail(token);
        return (email.equals(userEmail) && !isTokenExpired(token));
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    // Check if token has expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from token
    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // Extract claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes())) // Use this to set the signing key
                .build()
                .parseClaimsJws(token) // Parse the token here
                .getBody(); // Get the claims
    }
}


