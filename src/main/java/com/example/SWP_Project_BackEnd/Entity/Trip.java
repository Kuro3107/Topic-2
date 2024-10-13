package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.*;

@Entity
@Table(name = "trip")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id",nullable = false)
    private Long tripId;

    @Column(name = "trip_name")
    private String tripName;

    @Column(name = "price_total")
    private double priceTotal;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TripDetail> tripDetails = new ArrayList<>();


    @OneToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tripdetail_koifarm", // Bảng nối giữa Trip và KoiFarm
            joinColumns = @JoinColumn(name = "trip_id"), // Cột trong bảng Trip
            inverseJoinColumns = @JoinColumn(name = "farm_id") // Cột trong bảng KoiFarm
    )
    private List<KoiFarm> koiFarms = new ArrayList<>();

}



