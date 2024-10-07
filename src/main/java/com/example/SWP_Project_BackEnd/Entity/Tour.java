package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "trip")
@Getter
@Setter
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    private Long tripDetailId;
    private String tripName;
    private Double priceTotal;

    // Constructors, getters, and setters
    public Tour() {}

    public Tour(Long tripDetailId, String tripName, Double priceTotal) {
        this.tripDetailId = tripDetailId;
        this.tripName = tripName;
        this.priceTotal = priceTotal;
    }

    // Getters and Setters...
}
