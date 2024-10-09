package com.example.SWP_Project_BackEnd.Dto;

import com.example.SWP_Project_BackEnd.Entity.Account;
//import com.example.SWP_Project_BackEnd.Entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private int role_id;
    private Account user;

    public LoginResponse(String token, int role_id, Account user) {
        this.token = token;
        this.role_id = role_id;
        this.user = user;
    }

    // Getter and setter methods
}

