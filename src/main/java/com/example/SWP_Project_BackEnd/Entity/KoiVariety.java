package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "koi_variety")
@Getter
@Setter
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "varietyId")
public class KoiVariety {
    @Id
    @Column(name = "variety_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long varietyId;


    @Column(name = "variety_name")
    private String varietyName;
    @Column(name = "description")
    private String description;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "koi_price")
    private double koiPrice;

    @ManyToMany(mappedBy = "koiVarieties",fetch = FetchType.LAZY) // Sử dụng mappedBy để ánh xạ ngược lại quan hệ trong Trip
    @JsonIgnore // Để tránh vòng lặp tuần hoàn khi trả dữ liệu về
    private List<KoiFarm> koiFarms = new ArrayList<>();

    @OneToMany(mappedBy = "variety")
//    @JsonBackReference
    @JsonIgnore
    private List<PODetail> poDetails = new ArrayList<>(); // Thay đổi từ poDetail sang poDetails và chuyển thành List

//    @OneToMany
//    @JoinTable(
//            name = "farm_variety",
//            joinColumns = @JoinColumn(name = "variety_id"),
//            inverseJoinColumns = @JoinColumn(name = "farm_id")
//    )
//    private List<KoiFarm> koiFarms;

    // Getters and setters
}
