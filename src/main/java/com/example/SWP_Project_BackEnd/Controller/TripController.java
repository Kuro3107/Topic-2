package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.Trip;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Service.TripDetailService;
import com.example.SWP_Project_BackEnd.Service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        List<Trip> trips = tripService.getAllTrips();
        return new ResponseEntity<>(trips, HttpStatus.OK);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long tripId) {
        Trip trip = tripService.getTripById(tripId);
        return new ResponseEntity<>(trip, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        Trip createdTrip = tripService.createTrip(trip);
        return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);
    }

    @PutMapping("/{tripId}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long tripId, @RequestBody Trip tripDetails) {
        Trip updatedTrip = tripService.updateTrip(tripId, tripDetails);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long tripId) {
        tripService.deleteTrip(tripId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Thêm farm vào trip
    @PostMapping("/{tripId}/farms")
    public ResponseEntity<Trip> addFarmToTrip(@PathVariable Long tripId, @RequestBody KoiFarm koiFarm) {
        Trip updatedTrip = tripService.addKoiFarmToTrip(tripId, koiFarm);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    // Xóa farm khỏi trip
    @DeleteMapping("/{tripId}/farms/{farmId}")
    public ResponseEntity<Trip> removeFarmFromTrip(@PathVariable Long tripId, @PathVariable Long farmId) {
        Trip updatedTrip = tripService.removeKoiFarmFromTrip(tripId, farmId);
        return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
    }

    // Thêm trip detail vào trip
    @PostMapping("/{tripId}/trip-details")
    public ResponseEntity<TripDetail> addTripDetail(@PathVariable Long tripId, @RequestBody TripDetail tripDetail) {
        TripDetail createdTripDetail = tripService.addTripDetail(tripId, tripDetail);
        return new ResponseEntity<>(createdTripDetail, HttpStatus.CREATED);
    }

    // Cập nhật trip detail
    @PutMapping("/{tripId}/trip-details/{tripDetailId}")
    public ResponseEntity<TripDetail> updateTripDetail1(@PathVariable Long tripId, @PathVariable Long detailId, @RequestBody TripDetail tripDetail) {
        TripDetail updatedTripDetail = tripService.updateTripDetail(tripId, detailId, tripDetail);
        return new ResponseEntity<>(updatedTripDetail, HttpStatus.OK);
    }

    // Xóa trip detail
    @DeleteMapping("/{tripId}/trip-details/{tripDetailId}")
    public ResponseEntity<Void> deleteTripDetail(@PathVariable Long tripId, @PathVariable Long detailId) {
        tripService.deleteTripDetail(tripId, detailId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

