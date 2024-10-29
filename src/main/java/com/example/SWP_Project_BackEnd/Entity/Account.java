package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "account")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "accountId")
public class Account {
    @Id
    @Column(name = "account_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer accountId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(unique = true)
    private String email;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "role_id", nullable = false)
    private int roleId;  // Đảm bảo sử dụng role_id đồng bộ với database

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "status")
    private String status;

    // Liên kết OneToOne với Customer
    @OneToOne(mappedBy = "account")
//    @JsonManagedReference
    private Customer customer;
    // Constructors, getters, and setters
}


