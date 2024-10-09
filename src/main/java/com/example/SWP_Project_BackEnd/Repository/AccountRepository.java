package com.example.SWP_Project_BackEnd.Repository;

import com.example.SWP_Project_BackEnd.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

    public interface AccountRepository extends JpaRepository<Account, Long> {
        Optional<Account> findByUsername(String username);
        Optional<Account> findByPhone(String phone);
        Optional<Account> findByEmail(String email);
    }


