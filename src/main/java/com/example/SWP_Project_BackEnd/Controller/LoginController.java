package com.example.SWP_Project_BackEnd.Controller;
import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
import com.example.SWP_Project_BackEnd.Dto.LoginResponse;
import com.example.SWP_Project_BackEnd.Dto.RegisterRequest;
//import com.example.SWP_Project_BackEnd.Entity.User;
import com.example.SWP_Project_BackEnd.Service.AccountService;
//import com.example.SWP_Project_BackEnd.Service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")  // Cấu hình CORS tại controller
public class LoginController {
    @Autowired
    private AccountService userService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = userService.loginUser(loginRequest);

        if (loginResponse == null) {
            return ResponseEntity.badRequest().body("Wrong username or password");
        }

        return ResponseEntity.ok(loginResponse);
    }
}


