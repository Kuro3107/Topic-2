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
public class KoiFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long koiId;

    private String type;
    private Double koiPrice;
    private String size;
    private Long varietyId;
    private String imageUrl;
}
