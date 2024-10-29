package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "farm_variety")
@Getter
@Setter
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "farmVarietyId")
public class FarmVariety {
    @Id
    @Column(name = "farm_variety_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer farmVarietyId;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private KoiFarm koiFarm;

    @ManyToOne
    @JoinColumn(name = "variety_id")
    private KoiVariety koiVariety;

    // Getters and setters
}
