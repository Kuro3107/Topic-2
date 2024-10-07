package com.example.SWP_Project_BackEnd.Repository;

import com.example.SWP_Project_BackEnd.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
}
