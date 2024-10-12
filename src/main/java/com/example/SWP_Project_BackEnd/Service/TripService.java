package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.Trip;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripId));

        System.out.println("Trip: " + trip);
        System.out.println("Trip Details: " + trip.getTripDetails());


        return trip;
    }

    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
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
}

