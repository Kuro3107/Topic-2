package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.Trip;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.KoiFarmRepository;
import com.example.SWP_Project_BackEnd.Repository.TripDetailRepository;
import com.example.SWP_Project_BackEnd.Repository.TripRepository;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripDetailRepository tripDetailRepository;

    @Autowired
    private KoiFarmRepository koiFarmRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Integer tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));
    }

    public Trip createTrip(Trip trip) {
        // Lưu trip trước để có tripId
        Trip createdTrip = tripRepository.save(trip);

        // Nếu có tripDetails, hãy lưu chúng
        if (trip.getTripDetails() != null) {
            for (TripDetail detail : trip.getTripDetails()) {
                detail.setTrip(createdTrip); // Gán tripId cho tripDetail
                tripDetailRepository.save(detail); // Lưu tripDetail
            }
        }

        return createdTrip;
    }


    public Trip updateTrip(Integer tripId, Trip tripDetails) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        trip.setTripName(tripDetails.getTripName());
        trip.setPriceTotal(tripDetails.getPriceTotal());
        trip.setImageUrl(tripDetails.getImageUrl());
        trip.setSaleName(tripDetails.getSaleName());

        return tripRepository.save(trip);
    }

    public void deleteTrip(Integer tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));
        tripRepository.delete(trip);
    }

    public Trip addKoiFarmToTrip(Integer tripId, KoiFarm koiFarm) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));


        // Thêm KoiFarm đã lưu vào Trip
        trip.getKoiFarms().add(koiFarm);
        return tripRepository.save(trip); // Lưu trip để cập nhật
    }

    public Trip removeKoiFarmFromTrip(Integer tripId, Integer farmId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        KoiFarm farmToRemove = trip.getKoiFarms().stream()
                .filter(farm -> farm.getFarmId().equals(farmId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id " + farmId));

        trip.getKoiFarms().remove(farmToRemove);
        return tripRepository.save(trip); // Lưu trip để cập nhật

    }

    public TripDetail addTripDetail(Integer tripId, TripDetail tripDetail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        tripDetail.setTrip(trip); // Liên kết trip với trip detail
        // Giả sử bạn có repository cho TripDetail
        return tripDetailRepository.save(tripDetail);
    }

    public TripDetail updateTripDetail(Integer tripId, Integer tripDetailId, TripDetail tripDetail) {
        // Tìm trip detail dựa trên tripId và tripDetailId
        TripDetail existingDetail = tripDetailRepository.findByTrip_TripIdAndTripDetailId(tripId, tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip detail not found for this trip and detail id"));

        // Kiểm tra xem dữ liệu có thay đổi không trước khi cập nhật
        if (!existingDetail.equals(tripDetail)) {
            existingDetail.setMainTopic(tripDetail.getMainTopic());
            existingDetail.setSubTopic(tripDetail.getSubTopic());
            existingDetail.setNotePrice(tripDetail.getNotePrice());
            existingDetail.setDay(tripDetail.getDay());
        }

            return tripDetailRepository.save(existingDetail);

    }


    public void deleteTripDetail(Integer tripId, Integer tripDetailId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        TripDetail detailToDelete = tripDetailRepository.findById(tripDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip detail not found with id " + tripDetailId));

        tripDetailRepository.delete(detailToDelete);
    }
}

