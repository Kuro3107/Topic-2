package com.example.SWP_Project_BackEnd.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for testing purposes (you can enable it later with proper configuration)
                .csrf(csrf -> csrf.disable())

                // Allow public access to register and login endpoints
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login", "/swagger-resources/**", "/swagger-ui/**","/api/farms","/api/farms/{id}","/api/tours","/api/tours/{id}",
                                "/api/accounts","/api/accounts/{id}").permitAll()
                        .anyRequest().authenticated()
                )

                // Use basic HTTP authentication for the remaining endpoints (you can switch to JWT later)
                .httpBasic(withDefaults());
        return http.build();
    }
}

