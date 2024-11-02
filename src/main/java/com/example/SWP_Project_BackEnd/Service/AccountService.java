package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
import com.example.SWP_Project_BackEnd.Dto.LoginResponse;
import com.example.SWP_Project_BackEnd.Entity.Account;
import com.example.SWP_Project_BackEnd.Entity.Customer;
import com.example.SWP_Project_BackEnd.Repository.AccountRepository;
import com.example.SWP_Project_BackEnd.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String registerUser(Account account, String rePassword) {
        System.out.println("Full Name in Account: " + account.getFullName()); // Log giá trị fullName
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            return "Username already exists";
        }

        if (accountRepository.findByPhone(account.getPhone()).isPresent()) {
            return "Phone number already exists";
        }

        if (account.getEmail() != null && accountRepository.findByEmail(account.getEmail()).isPresent()) {
            return "Email already exists";
        }


        if (!account.getPassword().equals(rePassword)) {
            return "Passwords do not match";
        }

        if (!isValidPhone(account.getPhone())) {
            return "Phone not valid";
        }

//        if (!isValidEmail(account.getEmail())) {
//            return "Email not valid";
//        }

        // Mã hóa mật khẩu trước khi lưu
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        account.setFullName(account.getFullName());
        account.setEmail(account.getEmail());

        // Lưu tài khoản vào cơ sở dữ liệu
        accountRepository.save(account);
        // Tạo một bản ghi trong bảng Customer với account_id
        Customer customer = new Customer();
        customer.setAccount(account); // Liên kết với account_id
        customerRepository.save(customer);
        return "User registered successfully";
    }


    public LoginResponse loginUser(LoginRequest loginRequest) {
        // Check if the user exists
        Optional<Account> optionalAccount = accountRepository.findByUsername(loginRequest.getUsername());
        if (optionalAccount.isEmpty()) {
            return null; // Username not found
        }

        Account account = optionalAccount.get();

        // Check if the password is correct
        if (!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())) {
            return null; // Incorrect password
        }

        // Generate token
        String token = generateTokenForUser(account);

        // Return a new LoginResponse object with necessary information
        return new LoginResponse(token, account.getRoleId(), account);
    }

    // Additional CRUD methods can remain
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Optional<Account> getAccountById(Integer id) {
        return accountRepository.findById(id);
    }

    public Account updateAccount(Integer id, Account accountDetails) {
        Optional<Account> account = accountRepository.findById(id);
        if (account.isPresent()) {
            Account existingAccount = account.get();

            if (accountDetails.getUsername() != null) {
                existingAccount.setUsername(accountDetails.getUsername());
            }
            if (accountDetails.getPhone() != null) {
                existingAccount.setPhone(accountDetails.getPhone());
            }

                existingAccount.setEmail(accountDetails.getEmail());

//            if (accountDetails.getImageUrl() != null) {
//                existingAccount.setImageUrl(accountDetails.getImageUrl());
//            }
            if (accountDetails.getRoleId() != 0) { // Kiểm tra thêm nếu cần với vai trò mặc định
                existingAccount.setRoleId(accountDetails.getRoleId());
            }
            if (accountDetails.getStatus() != null) {
                existingAccount.setStatus(accountDetails.getStatus());
            }

                existingAccount.setFullName(accountDetails.getFullName());


            return accountRepository.save(existingAccount);
        }
        return null;
    }


    public Account updateAccountByManager(Integer id, Account accountDetails) {
        Optional<Account> account = accountRepository.findById(id);
        if (account.isPresent()) {
            Account existingAccount = account.get();
            existingAccount.setUsername(accountDetails.getUsername());
            existingAccount.setPhone(accountDetails.getPhone());
            existingAccount.setEmail(accountDetails.getEmail());
            existingAccount.setImageUrl(accountDetails.getImageUrl());
            existingAccount.setRoleId(accountDetails.getRoleId());
            existingAccount.setStatus(accountDetails.getStatus());
            existingAccount.setFullName(accountDetails.getFullName());
            return accountRepository.save(existingAccount);
        }
        return null;
    }

    public Account updateAccountImage(Integer id, String imageUrl) {
        Optional<Account> optionalAccount = accountRepository.findById(id);
        if (optionalAccount.isPresent()) {
            Account existingAccount = optionalAccount.get();
            existingAccount.setImageUrl(imageUrl); // Cập nhật trường imageUrl
            return accountRepository.save(existingAccount);
        }
        return null;
    }

    public void deleteAccount(Integer id) {
        accountRepository.deleteById(id);
    }

    // Validation methods
    private boolean isValidPhone(String phone) {
        return phone.matches("^0\\d{9}$");
    }

    private boolean isValidEmail(String email) {
        return email.matches("^[\\w.-]+@gmail\\.com$");
    }

    private String generateTokenForUser(Account account) {
        // Token generation logic here
        return "some_generated_token"; // Replace with actual token generation logic
    }
    public Account createAccount(Account account) {
        // Mã hóa mật khẩu trước khi lưu
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        return accountRepository.save(account);
    }
}

