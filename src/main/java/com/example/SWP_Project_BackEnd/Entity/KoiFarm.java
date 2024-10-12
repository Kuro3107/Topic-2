package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "koifarm")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class KoiFarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "farm_id")
    private Long farmId;

//    @ManyToMany(mappedBy = "koiFarms", fetch = FetchType.LAZY)
//    private Set<TripDetail> tripDetails = new HashSet<>();

    @Column(name = "farm_name")
    private String farmName;

    @Column(name = "location")
    private String location;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "image_url")
    private String imageUrl;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        KoiFarm koiFarm = (KoiFarm) o;
        return Objects.equals(farmId, koiFarm.farmId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(farmId);
    }
}
