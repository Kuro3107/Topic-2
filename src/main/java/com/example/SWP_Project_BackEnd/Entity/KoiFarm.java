package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "koifarm")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KoiFarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "farm_id", nullable = false)
    private Long farmId;

    @Column(name = "farm_name")
    private String farmName;

    @Column(name = "location")
    private String location;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToMany(mappedBy = "koiFarms",fetch = FetchType.LAZY) // Sử dụng mappedBy để ánh xạ ngược lại quan hệ trong Trip
    @JsonIgnore // Để tránh vòng lặp tuần hoàn khi trả dữ liệu về
    private List<Trip> trips = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "farm_variety",
            joinColumns = @JoinColumn(name = "farm_id"),
            inverseJoinColumns = @JoinColumn(name = "variety_id")
    )
    private List<KoiVariety> koiVarieties = new ArrayList<>();
//
//    @ManyToMany(mappedBy = "koiFarms", fetch = FetchType.LAZY)
//    @JsonIgnore
//    private List<TripDetail> tripDetails = new ArrayList<>();

//    @ManyToMany
//    @JsonIgnore
//    @JoinTable(
//            name = "tripdetail_koifarm",
//            joinColumns = @JoinColumn(name = "farm_id"),
//            inverseJoinColumns = @JoinColumn(name = "trip_id")
//    )
//    private List<TripDetail> tripDetails;

}


