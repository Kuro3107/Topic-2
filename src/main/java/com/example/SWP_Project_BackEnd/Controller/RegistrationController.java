package com.example.SWP_Project_BackEnd.Controller;
import com.example.SWP_Project_BackEnd.Dto.RegisterRequest;
import com.example.SWP_Project_BackEnd.Entity.User;
import com.example.SWP_Project_BackEnd.Service.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class RegistrationController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setEmail(registerRequest.getEmail());

        // Default values for new customer
        user.setImageURL(null);  // No image by default
        user.setStatus(null);  // Status not applicable for customers

        String result = userService.registerUser(user, registerRequest.getRePassword());

        if (result.equals("User registered successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}


