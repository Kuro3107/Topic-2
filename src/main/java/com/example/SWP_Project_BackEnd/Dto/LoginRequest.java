package com.example.SWP_Project_BackEnd.Dto;

public class LoginRequest {
    private String username;
    private String password;
    private String idToken;  // Thêm thuộc tính cho đăng nhập Google

    // Getters and Setters

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}

