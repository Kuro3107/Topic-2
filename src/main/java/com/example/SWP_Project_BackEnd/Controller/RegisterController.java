package com.example.SWP_Project_BackEnd.Controller;
import com.example.SWP_Project_BackEnd.Dto.RegisterRequest;
import com.example.SWP_Project_BackEnd.Entity.Account;
//import com.example.SWP_Project_BackEnd.Entity.User;
import com.example.SWP_Project_BackEnd.Service.AccountService;
//import com.example.SWP_Project_BackEnd.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class RegisterController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        Account account = new Account();
        account.setUsername(registerRequest.getUsername());
        account.setPassword(registerRequest.getPassword());
        account.setFullName(registerRequest.getFullName()); // Gán fullName
        account.setPhone(registerRequest.getPhone());
        account.setEmail(registerRequest.getEmail());
        account.setRoleId(registerRequest.getRole_id());

        // Các giá trị mặc định khác
        account.setImageUrl(null);  // No image by default
        account.setStatus(null);  // Status not applicable for customers

        String result = accountService.registerUser(account, registerRequest.getRePassword());

        if (result.equals("User registered successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}



