package com.example.SWP_Project_BackEnd.Controller;
import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
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
public class LoginController {
    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        String result = userService.loginUser(loginRequest);

        if (result.equals("wrong username") || result.equals("wrong password")) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }
}
