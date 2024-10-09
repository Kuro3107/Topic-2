//package com.example.SWP_Project_BackEnd.Service;
//import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
//import com.example.SWP_Project_BackEnd.Dto.LoginResponse;
////import com.example.SWP_Project_BackEnd.Entity.User;
////import com.example.SWP_Project_BackEnd.Repository.UserRepository;
//import com.example.SWP_Project_BackEnd.Entity.Account;
//import com.example.SWP_Project_BackEnd.Repository.AccountRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class UserService {
//    @Autowired
//    private AccountRepository accountRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    public String registerUser(Account account, String rePassword) {
//        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
//            return "Username already exists";
//        }
//
//        if (accountRepository.findByPhone(account.getPhone()).isPresent()) {
//            return "Phone number already exists";
//        }
//
//        if (accountRepository.findByEmail(account.getEmail()).isPresent()) {
//            return "Email already exists";
//        }
//
//        if (!account.getPassword().equals(rePassword)) {
//            return "Passwords do not match";
//        }
//
//        if (!isValidPhone(account.getPhone())) {
//            return "Phone not valid";
//        }
//
//        if (!isValidEmail(account.getEmail())) {
//            return "Email not valid";
//        }
//
//        // Mã hóa mật khẩu trước khi lưu
//        account.setPassword(passwordEncoder.encode(account.getPassword()));
//
//        // Thiết lập role mặc định cho khách hàng
//        account.setRoleId(5);
//
//        // Lưu account vào cơ sở dữ liệu
//        accountRepository.save(account);
//        return "User registered successfully";
//    }
//
//
//    // Validate phone: 10 digits and starts with 0
//    private boolean isValidPhone(String phone) {
//        return phone.matches("^0\\d{9}$");
//    }
//
//    // Validate email: ends with @gmail.com
//    private boolean isValidEmail(String email) {
//        return email.matches("^[\\w.-]+@gmail\\.com$");
//    }
//
//    private String encodePassword(String password) {
//        return passwordEncoder.encode(password); // Sử dụng BCryptPasswordEncoder để mã hóa mật khẩu
//    }
//
//    public LoginResponse loginUser(LoginRequest loginRequest) {
//        // Kiểm tra xem người dùng có tồn tại không
//        Optional<Account> optionalAccount = accountRepository.findByUsername(loginRequest.getUsername());
//        if (optionalAccount.isEmpty()) {
//            return null; // Username not found, trả về null
//        }
//
//        Account account = optionalAccount.get();
//
//        // Kiểm tra xem mật khẩu có đúng không
//        if (!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())) {
//            return null; // Incorrect password
//        }
//
//        // Giả sử bạn có một phương thức để tạo token cho người dùng
//        String token = generateTokenForUser(account);
//
//        // Trả về một đối tượng LoginResponse mới với thông tin cần thiết
//        return new LoginResponse(token, account.getRoleId(), account);
//    }
//
//    private String generateTokenForUser(Account account) {
//        // Tạo token (điều này có thể khác nhau tùy theo cách bạn thực hiện)
//        return "some_generated_token"; // Thay thế với logic tạo token thực sự
//    }
//}
//
//
//// Method to update passwords for all users
////    public void encodeAllPasswords() {
////        List<User> users = userRepository.findAll(); // Fetch all users
////
////        for (User user : users) {
////            // Encode the existing password
////            String encodedPassword = passwordEncoder.encode(user.getPassword());
////            user.setPassword(encodedPassword); // Set the encoded password
////
////            userRepository.save(user); // Save the updated user
////        }
////    }
//
