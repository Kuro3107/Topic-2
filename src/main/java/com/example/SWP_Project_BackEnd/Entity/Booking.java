package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "bookingId")
public class Booking {
    @Id
    @Column(name = "booking_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;
    @Column(name = "trip_id")
    private Integer tripId;
    @Column(name = "po_id")
    private Integer poId;
    @Column(name = "booking_payment_id")
    private Integer bookingPaymentId;
    @Column(name = "feedback_id")
    private Long feedbackId;
    @Column(name = "quote_sent_date")
    private Date quoteSentDate;
    @Column(name = "quote_approved_date")
    private Date quoteApprovedDate;
    @Column(name = "status")
    private String status;
    @Column(name = "start_date")
    private Date startDate;
    @Column(name = "end_date", nullable = true)
    private Date endDate;
    @Column(name = "quoted_amount", nullable = true)
    private Integer quotedAmount;
    @Column(name = "booking_date")
    private LocalDate bookingDate;
    @Column(name = "full_name")
    private String fullname;
    @Column(name = "phone")
    private String phone;
    @Column(name = "email")
    private String email;
    @Column(name = "favorite_farm")
    private String favoriteFarm;
    @Column(name = "favorite_koi")
    private String favoriteKoi;
    @Column(name = "note")
    private String note;
    @Column(name = "is_active")
    private Boolean isActive;
    // Liên kết ManyToOne với Customer
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
}