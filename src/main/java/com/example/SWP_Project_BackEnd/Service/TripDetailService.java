package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Dto.TripDetailDTO;
import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.KoiFarmRepository;
import com.example.SWP_Project_BackEnd.Repository.TripDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TripDetailService {

    @Autowired
    private TripDetailRepository tripDetailRepository;

    @Autowired
    private KoiFarmRepository koiFarmRepository; // Thêm vào repo để truy vấn các trang trại


    public List<TripDetail> getAllTripDetails() {
        return tripDetailRepository.findAll();
    }



    public TripDetail getTripDetailById(Long tripDetailId) {
        return tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("TripDetail not found with id " + tripDetailId));
    }

    public TripDetail createTripDetail(TripDetail tripDetail) {
        return tripDetailRepository.save(tripDetail);
    }

    public TripDetail updateTripDetail(Long tripDetailId, TripDetail tripDetailDetails) {
        TripDetail tripDetail = tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("TripDetail not found with id " + tripDetailId));

        tripDetail.setMainTopic(tripDetailDetails.getMainTopic());
        tripDetail.setSubTopic(tripDetailDetails.getSubTopic());
        tripDetail.setNotePrice(tripDetailDetails.getNotePrice());
        tripDetail.setDay(tripDetailDetails.getDay());

        return tripDetailRepository.save(tripDetail);
    }

    public void deleteTripDetail(Long tripDetailId) {
        TripDetail tripDetail = tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("TripDetail not found with id " + tripDetailId));
        tripDetailRepository.delete(tripDetail);
    }
}

