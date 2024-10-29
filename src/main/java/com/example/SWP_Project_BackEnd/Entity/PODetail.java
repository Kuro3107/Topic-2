package com.example.SWP_Project_BackEnd.Entity;


import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "podetail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "poDetailId")
public class PODetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_detail_id")
    private Integer poDetailId;

    // Liên kết với Koifish (OneToOne)
    @OneToOne
    @JoinColumn(name = "variety_id", referencedColumnName = "variety_id")
//    @JsonManagedReference
    private KoiVariety variety;

    // Liên kết với Koifarm (OneToOne)
    @ManyToOne
    @JoinColumn(name = "farm_id", referencedColumnName = "farm_id")
//    @JsonManagedReference
    private KoiFarm farm;

    @Column(name = "deposit")
    private Double deposit;

    @Column(name = "total_koi_price")
    private Double totalKoiPrice;

    @Column(name = "remaining_price")
    private Double remainingPrice;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "day")
    private String day;

    // Liên kết ManyToOne với PO
    @ManyToOne
    @JoinColumn(name = "po_id")
//    @JsonBackReference // Tránh vòng lặp với PO
    @JsonIgnore
    private PO po;
}

