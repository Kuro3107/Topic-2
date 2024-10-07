package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "account")
@Getter
@Setter
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    private String username;
    private String phone;
    private String email;
    @Column(name = "image_url") // Sử dụng cùng 1 tên cột vật lý
    private String imageUrl;
    private Long roleId;
    private String status;
    private String fullName;

    // Constructors, getters, and setters
    public Account() {}

    public Account(String username, String phone, String email, String imageUrl, Long roleId, String status, String fullName) {
        this.username = username;
        this.phone = phone;
        this.email = email;
        this.imageUrl = imageUrl;
        this.roleId = roleId;
        this.status = status;
        this.fullName = fullName;
    }
}

