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
    @Column(name = "farm_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long farmId;

    @Column(name = "trip_detail_id")
    private Long tripDetailId;
    @Column(name = "koi_id")
    private Long koiId;
    @Column(name = "farm_name")
    private String farmName;
    @Column(name = "location")
    private String location;
    @Column(name = "contact_info")
    private String contactInfo;
    @Column(name = "image_url")
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
