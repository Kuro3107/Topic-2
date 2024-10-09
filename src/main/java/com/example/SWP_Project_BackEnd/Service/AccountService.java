package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Dto.LoginRequest;
import com.example.SWP_Project_BackEnd.Dto.LoginResponse;
import com.example.SWP_Project_BackEnd.Entity.Account;
import com.example.SWP_Project_BackEnd.Repository.AccountRepository;
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
    private PasswordEncoder passwordEncoder;

    public String registerUser(Account account, String rePassword) {
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            return "Username already exists";
        }

        if (accountRepository.findByPhone(account.getPhone()).isPresent()) {
            return "Phone number already exists";
        }

        if (accountRepository.findByEmail(account.getEmail()).isPresent()) {
            return "Email already exists";
        }

        if (!account.getPassword().equals(rePassword)) {
            return "Passwords do not match";
        }

        if (!isValidPhone(account.getPhone())) {
            return "Phone not valid";
        }

        if (!isValidEmail(account.getEmail())) {
            return "Email not valid";
        }

        // Encrypt the password before saving
        account.setPassword(passwordEncoder.encode(account.getPassword()));

        // Set default role for customer
        account.setRoleId(5);

        // Save the account into the database
        accountRepository.save(account);
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

    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id);
    }

    public Account updateAccount(Long id, Account accountDetails) {
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

    public void deleteAccount(Long id) {
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
        return accountRepository.save(account);
    }
}

