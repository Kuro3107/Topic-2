//package com.example.SWP_Project_BackEnd.Entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name = "account")
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//public class User {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long accountId;  // Auto-generated account ID
//
//    @Column(unique = true, nullable = false)
//    private String username;
//
//    @Column(nullable = false)
//    private String password;
//
//    @Column(nullable = true)
//    private String fullName;
//
//    @Column(unique = true, nullable = false)
//    private String phone;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    @Column(nullable = true)
//    private String imageURL;  // Image URL, optional
//
//    @Column(nullable = false)
//    private int roleId = 5;   // Default role ID is 5 (Customer)
//
//    @Column(nullable = true)
//    private String status;  // Staff status, nullable for customers
//
//    // Getters and Setters
//}
