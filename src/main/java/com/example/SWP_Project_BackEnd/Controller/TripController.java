package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.Trip;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Repository.TripDetailRepository;
import com.example.SWP_Project_BackEnd.Service.KoiFarmService;
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

    @Autowired
    private KoiFarmService koiFarmService;

    @Autowired
    private TripDetailService tripDetailService;

    @Autowired
    private TripDetailRepository tripDetailRepository;

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

        // Log to check the received data
        System.out.println("Received TripDetails: " + trip.getTripDetails());

        // Nếu có tripDetails, hãy lưu chúng
        if (trip.getTripDetails() != null && !trip.getTripDetails().isEmpty()) {
            for (TripDetail detail : trip.getTripDetails()) {
                detail.setTrip(createdTrip); // Gán trip cho tripDetail
                tripDetailRepository.save(detail); // Lưu tripDetail
            }
        }

        // Nếu có KoiFarms, hãy thêm chúng vào trip
        if (trip.getKoiFarms() != null && !trip.getKoiFarms().isEmpty()) {
            for (KoiFarm farm : trip.getKoiFarms()) {
                tripService.addKoiFarmToTrip(createdTrip.getTripId(), farm);
            }
        }
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
    public ResponseEntity<Void> addFarmToTrip(@PathVariable Long tripId, @RequestBody KoiFarm koiFarm) {

        // Thêm farm vào trip thông qua bảng trung gian
        tripService.addKoiFarmToTrip(tripId, koiFarm);
        return ResponseEntity.ok().build();
    }

    // Xóa farm khỏi trip
    @DeleteMapping("/{tripId}/farms/{farmId}")
    public ResponseEntity<Void> removeFarmFromTrip(@PathVariable Long tripId, @PathVariable Long farmId) {

        // Xóa farm khỏi trip
        tripService.removeKoiFarmFromTrip(tripId, farmId);
        return ResponseEntity.ok().build();
    }

    // Thêm trip detail vào trip
    @PostMapping("/{tripId}/trip-details")
    public ResponseEntity<TripDetail> addTripDetail(@PathVariable Long tripId, @RequestBody TripDetail tripDetail) {
        System.out.println("Received TripDetail: " + tripDetail);
        TripDetail createdTripDetail = tripService.addTripDetail(tripId, tripDetail);
        return new ResponseEntity<>(createdTripDetail, HttpStatus.CREATED);
    }

    // Cập nhật trip detail
    @PutMapping("/{tripId}/trip-details/{tripDetailId}")
    public ResponseEntity<TripDetail> updateTripDetail(@PathVariable Long tripId, @PathVariable Long tripDetailId, @RequestBody TripDetail tripDetail) {
        System.out.println("Received TripDetail: " + tripDetail);
        TripDetail updatedTripDetail = tripService.updateTripDetail(tripId, tripDetailId, tripDetail);
        return new ResponseEntity<>(updatedTripDetail, HttpStatus.OK);
    }

    // Xóa trip detail
    @DeleteMapping("/{tripId}/trip-details/{tripDetailId}")
    public ResponseEntity<Void> deleteTripDetail(@PathVariable Long tripId, @PathVariable Long tripDetailId) {
        tripService.deleteTripDetail(tripId, tripDetailId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

