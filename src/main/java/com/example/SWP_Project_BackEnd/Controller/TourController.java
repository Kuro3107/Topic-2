package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.Tour;
import com.example.SWP_Project_BackEnd.Service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    private TourService tourService;

    @GetMapping
    public List<Tour> getAllTours() {
        return tourService.getAllTours();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Optional<Tour> tour = tourService.getTourById(id);
        if (tour.isPresent()) {
            return ResponseEntity.ok(tour.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Tour createTour(@RequestBody Tour tour) {
        return tourService.createTour(tour);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id, @RequestBody Tour tourDetails) {
        Tour updatedTour = tourService.updateTour(id, tourDetails);
        if (updatedTour != null) {
            return ResponseEntity.ok(updatedTour);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
}

