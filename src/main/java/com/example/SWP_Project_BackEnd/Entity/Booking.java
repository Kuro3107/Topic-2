package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private Long tripId;
    private Long poId;
    private Long bookingPaymentId;
    private Long feedbackId;
    private Long customerId;
    private LocalDate quoteSentDate;
    private LocalDate quoteApprovedDate;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private int quotedAmount;
    private LocalDate bookingDate;
    private String fullname;
    private String phone;
    private String email;
    private String favoriteFarm;
    private String favoriteKoi;
    private String note;
    private Boolean isActive;
}

