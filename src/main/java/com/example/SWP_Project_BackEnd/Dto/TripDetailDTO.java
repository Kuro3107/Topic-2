package com.example.SWP_Project_BackEnd.Dto;

import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TripDetailDTO {
    private TripDetail tripDetail;
    private int farmCount;

    public TripDetailDTO(TripDetail tripDetail, int farmCount) {
        this.tripDetail = tripDetail;
        this.farmCount = farmCount;
    }

    // Getter và setter...
}

