package com.example.SWP_Project_BackEnd.Dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class BookingDTO {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    private Long customerId;
    private Long tripId;
    private String fullname;
    private String phone;
    private String email;
    private String favoriteKoi;
    private String favoriteFarm;
    private String note;
    private String status;
    private Date startDate;
    private Date endDate;
    private LocalDate bookingDate;

    // Constructor
    public BookingDTO() {
        // Set bookingDate to the current date when a new booking is created
        this.bookingDate = LocalDate.now();
    }

    // Getters and setters

    public Date getEndDate() {
        return (endDate == null) ? null : new Date(endDate.getTime());
    }
}

