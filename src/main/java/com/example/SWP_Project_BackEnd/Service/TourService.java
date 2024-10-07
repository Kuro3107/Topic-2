package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.Tour;
import com.example.SWP_Project_BackEnd.Repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public Optional<Tour> getTourById(Long id) {
        return tourRepository.findById(id);
    }

    public Tour createTour(Tour tour) {
        return tourRepository.save(tour);
    }

    public Tour updateTour(Long id, Tour tourDetails) {
        Optional<Tour> tour = tourRepository.findById(id);
        if (tour.isPresent()) {
            Tour existingTour = tour.get();
            existingTour.setTripDetailId(tourDetails.getTripDetailId());
            existingTour.setTripName(tourDetails.getTripName());
            existingTour.setPriceTotal(tourDetails.getPriceTotal());
            return tourRepository.save(existingTour);
        }
        return null;
    }

    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
}

