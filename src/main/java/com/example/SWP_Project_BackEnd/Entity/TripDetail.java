package com.example.SWP_Project_BackEnd.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "tripdetail")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripDetail {
    @Id
    @Column(name = "trip_detail_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "main_topic")
    private String mainTopic;

    @Column(name = "sub_topic")
    private String subTopic;

    @Column(name = "note_price")
    private double notePrice;

    @Column(name = "day")
    private int day;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonIgnore
    private Trip trip;

    @ManyToMany
    @JoinTable(
            name = "tripdetail_koifarm",
            joinColumns = @JoinColumn(name = "trip_detail_id"),
            inverseJoinColumns = @JoinColumn(name = "farm_id")
    )
    private List<KoiFarm> farms;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TripDetail tripDetail = (TripDetail) o;
        return Objects.equals(id, tripDetail.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

