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
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        System.out.println("Full Name from Request: " + registerRequest.getFullName()); // Log giá trị fullName
        Account account = new Account();
        account.setUsername(registerRequest.getUsername());
        account.setPassword(registerRequest.getPassword());
        if (registerRequest.getFullName() != null && !registerRequest.getFullName().trim().isEmpty()) {
            account.setFullName(registerRequest.getFullName().trim());
        } else {
            account.setFullName(null); // hoặc chuỗi rỗng
        }
        if(registerRequest.getPhone() != null) {
            account.setPhone(registerRequest.getPhone());
        } else {
            account.setPhone(null);
        }

        // Bỏ qua việc lấy roleId từ request, luôn gán roleId là 5 cho khách hàng
        account.setRoleId(5);  // Set role_id là 5 mặc định cho khách hàng
        if (registerRequest.getEmail() != null && !registerRequest.getEmail().trim().isEmpty()) {
            account.setEmail(registerRequest.getEmail().trim());
        } else {
            account.setEmail(null); // hoặc chuỗi rỗng tùy theo thiết kế của bạn
        }

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



