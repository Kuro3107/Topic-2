package com.example.SWP_Project_BackEnd.Service;
import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
import com.example.SWP_Project_BackEnd.Entity.User;
import com.example.SWP_Project_BackEnd.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String registerUser(User user, String rePassword) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }

        if (userRepository.findByPhone(user.getPhone()).isPresent()) {
            return "Phone number already exists";
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists";
        }

        if (!user.getPassword().equals(rePassword)) {
            return "Passwords do not match";
        }

        if (!isValidPhone(user.getPhone())) {
            return "Phone not valid";
        }

        if (!isValidEmail(user.getEmail())) {
            return "Email not valid";
        }

        // Encrypt the password before saving
        user.setPassword(encodePassword(user.getPassword()));

        // Set default role for customer
        user.setRoleId(5);

        // Save the user into the database
        userRepository.save(user);
        return "User registered successfully";
    }

    // Validate phone: 10 digits and starts with 0
    private boolean isValidPhone(String phone) {
        return phone.matches("^0\\d{9}$");
    }

    // Validate email: ends with @gmail.com
    private boolean isValidEmail(String email) {
        return email.matches("^[\\w.-]+@gmail\\.com$");
    }
    @Autowired
    private PasswordEncoder passwordEncoder;

    private String encodePassword(String password) {
        // Here you can use an encoder like BCryptPasswordEncoder
        return password; // Temporary plain-text password (replace with real encoder)
    }

    public String loginUser(LoginRequest loginRequest) {
        // Check if the user exists
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
        if (user.isEmpty()) {
            return "Username not exist"; // Username not found
        }

        // Check if the password is correct
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            return "Wrong password"; // Incorrect password
        }

        // Return the role or any other information you need
        return "Login successful. Welcome " + user.get().getUsername();
    }
    // Method to update passwords for all users
//    public void encodeAllPasswords() {
//        List<User> users = userRepository.findAll(); // Fetch all users
//
//        for (User user : users) {
//            // Encode the existing password
//            String encodedPassword = passwordEncoder.encode(user.getPassword());
//            user.setPassword(encodedPassword); // Set the encoded password
//
//            userRepository.save(user); // Save the updated user
//        }
//    }
}
