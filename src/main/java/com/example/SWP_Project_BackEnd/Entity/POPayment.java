package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "popayment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class POPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long poPaymentId;

    private Long poId;
    private int amount;
}

