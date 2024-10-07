package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "koifarm")
@Getter
@Setter
public class KoiFarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long farmId;

    private Long tripDetailId;
    private Long koiId;
    private String farmName;
    private String location;
    private String contactInfo;
    private String imageUrl;

    // Constructors, getters, and setters
    public KoiFarm() {}

    public KoiFarm(Long tripDetailId, Long koiId, String farmName, String location, String contactInfo, String imageUrl) {
        this.tripDetailId = tripDetailId;
        this.koiId = koiId;
        this.farmName = farmName;
        this.location = location;
        this.contactInfo = contactInfo;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters...
}
