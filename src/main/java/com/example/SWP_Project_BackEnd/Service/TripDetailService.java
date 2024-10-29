package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Dto.TripDetailDTO;
import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.Trip;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.KoiFarmRepository;
import com.example.SWP_Project_BackEnd.Repository.TripDetailRepository;
import com.example.SWP_Project_BackEnd.Repository.TripRepository;
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

    @Autowired
    private TripRepository tripRepository;


    public List<TripDetail> getAllTripDetails() {
        return tripDetailRepository.findAll();
    }


    public TripDetail getTripDetailById(Integer tripDetailId) {
        // Tìm TripDetail theo ID
        TripDetail tripDetail = tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("TripDetail not found with id " + tripDetailId));

        // Trả về TripDetail với các KoiFarm liên quan
        return tripDetail;
    }


    public TripDetail createTripDetail(TripDetail tripDetail) {
        return tripDetailRepository.save(tripDetail);
    }

    public TripDetail updateTripDetail(Integer tripDetailId, TripDetail tripDetailDetails) {
        TripDetail tripDetail = tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("TripDetail not found with id " + tripDetailId));

        // Cập nhật các trường của trip detail chỉ khi có sự thay đổi
        if (tripDetailDetails.getMainTopic() != null &&
                !tripDetailDetails.getMainTopic().equals(tripDetail.getMainTopic())) {
            tripDetail.setMainTopic(tripDetailDetails.getMainTopic());
        }

        if (tripDetailDetails.getSubTopic() != null &&
                !tripDetailDetails.getSubTopic().equals(tripDetail.getSubTopic())) {
            tripDetail.setSubTopic(tripDetailDetails.getSubTopic());
        }

        // Cập nhật giá trị notePrice và day
        tripDetail.setNotePrice(tripDetailDetails.getNotePrice());
        tripDetail.setDay(tripDetailDetails.getDay());

        // Lưu lại đối tượng đã cập nhật
        return tripDetailRepository.save(tripDetail);
    }


    public void deleteTripDetail(Integer tripDetailId) {
        TripDetail tripDetail = tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("TripDetail not found with id " + tripDetailId));
        tripDetailRepository.delete(tripDetail);
    }

    public TripDetail addTripDetail(Integer tripId, TripDetail tripDetail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        tripDetail.setTrip(trip); // Liên kết trip với trip detail
        // Giả sử bạn có repository cho TripDetail
        return tripDetailRepository.save(tripDetail);
    }

    public TripDetail updateTripDetail1(Integer tripId, Integer detailId, TripDetail tripDetail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        TripDetail existingDetail = tripDetailRepository.findById(detailId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip detail not found with id " + detailId));

        // Cập nhật các trường của trip detail
        existingDetail.setMainTopic(tripDetail.getMainTopic());
        existingDetail.setSubTopic(tripDetail.getSubTopic());
        existingDetail.setNotePrice(tripDetail.getNotePrice());
        existingDetail.setDay(tripDetail.getDay());

        return tripDetailRepository.save(existingDetail);
    }

    public void deleteTripDetail(Integer tripId, Integer detailId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        TripDetail detailToDelete = tripDetailRepository.findById(detailId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip detail not found with id " + detailId));

        tripDetailRepository.delete(detailToDelete);
    }
}

