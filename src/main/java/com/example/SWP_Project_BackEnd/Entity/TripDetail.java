package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tripdetail")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_detail_id",nullable = false)
    private Long tripDetailId;

    @Column(name = "main_topic")
    private String mainTopic;

    @Column(name = "sub_topic")
    private String subTopic;

    @Column(name = "note_price")
    private String notePrice;

    @Column(name = "day")
    private int day;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

//    @OneToMany(mappedBy = "tripDetails", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
//    private List<KoiFarm> koiFarms = new ArrayList<>();
//    @OneToMany
//    @JoinTable(
//            name = "tripdetail_koifarm",
//            joinColumns = @JoinColumn(name = "trip_detail_id"),
//            inverseJoinColumns = @JoinColumn(name = "farm_id")
//    )
//    private List<KoiFarm> koiFarms;

}



