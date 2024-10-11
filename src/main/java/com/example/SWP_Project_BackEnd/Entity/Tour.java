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
    @Column(name = "trip_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

//    @Column(name = "trip_detail_id", nullable = false)
//    private Long tripDetailId;
    @Column(name = "trip_name", nullable = false)
    private String tripName;
    @Column(name = "price_total")
    private Double priceTotal;

    // Constructors, getters, and setters
    public Tour() {}

    public Tour(Long tripDetailId, String tripName, Double priceTotal) {
//        this.tripDetailId = tripDetailId;
        this.tripName = tripName;
        this.priceTotal = priceTotal;
    }

    // Getters and Setters...
}
