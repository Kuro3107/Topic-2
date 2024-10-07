package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.Account;
import com.example.SWP_Project_BackEnd.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id);
    }

    public Account createAccount(Account account) {
        return accountRepository.save(account);
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
}
