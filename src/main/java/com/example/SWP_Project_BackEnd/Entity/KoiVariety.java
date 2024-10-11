package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "koifish")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KoiVariety {
    @Id
    @Column(name = "variety_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long variety_id;
    @Column(name = "variety_name")
    private String variety_name;
    @Column(name = "description")
    private String description;
    @Column(name = "koi_price")
    private Double koi_price;
    @Column(name = "image_url")
    private String imageUrl;
}
