package com.example.SWP_Project_BackEnd.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class BookingDTO {

    private String fullname;
    private String phone;
    private String email;
    private List<String> favoriteKoi;
    private List<String> favoriteFarm;
    private String note;
    private String status;
    private Date startDate;
    private Date endDate;

    // Getters and setters
}

