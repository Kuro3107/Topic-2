package com.example.SWP_Project_BackEnd.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "farm_variety")
@Getter
@Setter
public class FarmVariety {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long farmVarietyId;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private KoiFarm koiFarm;

    @ManyToOne
    @JoinColumn(name = "variety_id")
    private KoiVariety koiVariety;

    // Getters and setters
}
