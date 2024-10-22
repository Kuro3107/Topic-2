package com.example.SWP_Project_BackEnd.Controller;
import com.example.SWP_Project_BackEnd.Dto.JwtProvider;
import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
import com.example.SWP_Project_BackEnd.Dto.LoginResponse;
//import com.example.SWP_Project_BackEnd.Entity.User;
import com.example.SWP_Project_BackEnd.Entity.Account;
import com.example.SWP_Project_BackEnd.Repository.AccountRepository;
import com.example.SWP_Project_BackEnd.Service.AccountService;
//import com.example.SWP_Project_BackEnd.Service.UserService;
import com.example.SWP_Project_BackEnd.Service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")  // Cấu hình CORS tại controller
public class LoginController {
    @Autowired
    private AccountService userService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private JwtProvider jwtProvider;


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        // Đăng nhập username
        LoginResponse loginResponse = userService.loginUser(loginRequest);

        if (loginResponse == null) {
            return ResponseEntity.badRequest().body("Wrong username or password");
        }

        // In ra response để kiểm tra
        System.out.println("LoginResponse: " + loginResponse.getUser().getAccountId());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/login-google")
    public ResponseEntity<?> loginWithGoogle(@RequestHeader("Authorization") String token) {
        try {
            String idToken = token.split(" ")[1];
            String googleEmail = googleAuthService.verifyGoogleToken(idToken);
            Optional<Account> account = accountRepository.findByEmail(googleEmail);

            if (account.isPresent()) {
                String jwtToken = jwtProvider.generateToken(account); // Generate JWT with the account info

                // Return account details and role as part of the response
                Map<String, Object> response = new HashMap<>();
                response.put("account", account); // Include account object with details
                response.put("role", account.get().getRoleId()); // Use getRoleId to get the role ID
                response.put("token", jwtToken); // JWT token

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body("No account found with this email");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Unauthorized: Invalid Google token");
        }
    }


}




