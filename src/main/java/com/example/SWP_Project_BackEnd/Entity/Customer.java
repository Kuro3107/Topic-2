package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "customer")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Customer {

    @Id
    @Column(name = "customer_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    // Liên kết OneToOne với Account
    @OneToOne
    @JoinColumn(name = "account_id")
    @JsonBackReference
    private Account account;

    // Liên kết OneToMany với Booking
    @OneToMany(mappedBy = "customer")
    private List<Booking> bookings;
}

