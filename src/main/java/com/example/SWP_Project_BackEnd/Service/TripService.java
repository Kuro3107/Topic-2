package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.Trip;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.TripDetailRepository;
import com.example.SWP_Project_BackEnd.Repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;
    private TripDetailRepository tripDetailRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long tripId) {
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


    public Trip updateTrip(Long tripId, Trip tripDetails) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        trip.setTripName(tripDetails.getTripName());
        trip.setPriceTotal(tripDetails.getPriceTotal());
        trip.setImageUrl(tripDetails.getImageUrl());

        return tripRepository.save(trip);
    }

    public void deleteTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));
        tripRepository.delete(trip);
    }

    public Trip addKoiFarmToTrip(Long tripId, KoiFarm koiFarm) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        trip.getKoiFarms().add(koiFarm);
        tripRepository.save(trip); // Lưu trip để cập nhật
        return trip;
    }

    public Trip removeKoiFarmFromTrip(Long tripId, Long farmId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        KoiFarm farmToRemove = trip.getKoiFarms().stream()
                .filter(farm -> farm.getFarmId().equals(farmId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id " + farmId));

        trip.getKoiFarms().remove(farmToRemove);
        tripRepository.save(trip); // Lưu trip để cập nhật
        return trip;
    }

    public TripDetail addTripDetail(Long tripId, TripDetail tripDetail) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        tripDetail.setTrip(trip); // Liên kết trip với trip detail
        // Giả sử bạn có repository cho TripDetail
        return tripDetailRepository.save(tripDetail);
    }

    public TripDetail updateTripDetail(Long tripId, Long detailId, TripDetail tripDetail) {
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

    public void deleteTripDetail(Long tripId, Long detailId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        TripDetail detailToDelete = tripDetailRepository.findById(detailId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip detail not found with id " + detailId));

        tripDetailRepository.delete(detailToDelete);
    }
}

