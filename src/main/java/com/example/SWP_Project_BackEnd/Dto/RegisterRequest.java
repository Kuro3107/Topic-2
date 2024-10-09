package com.example.SWP_Project_BackEnd.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String password;
    private String rePassword;
    private String fullName;
    private String phone;
    private String email;
    private int role_id;
}

