package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Dto.TripDetailDTO;
import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import com.example.SWP_Project_BackEnd.Service.TripDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip-details")
@CrossOrigin(origins = "http://localhost:5173")
public class TripDetailController {

    @Autowired
    private TripDetailService tripDetailService;

    @GetMapping
    public ResponseEntity<List<TripDetail>> getAllTripDetails() {
        List<TripDetail> tripDetails = tripDetailService.getAllTripDetails();
        return new ResponseEntity<>(tripDetails, HttpStatus.OK);
    }


    @GetMapping("/{tripDetailId}")
    public ResponseEntity<TripDetail> getTripDetailById(@PathVariable Long tripDetailId) {
        TripDetail tripDetail = tripDetailService.getTripDetailById(tripDetailId);

        return new ResponseEntity<>(tripDetail, HttpStatus.OK);
    }

//    @GetMapping("/{tripDetailId}/koifarms")
//    public ResponseEntity<List<KoiFarm>> getKoiFarmsByTripDetailId(@PathVariable("id") Long tripDetailId) {
//        List<KoiFarm> koiFarms = tripDetailService.getKoiFarmsByTripDetailId(tripDetailId);
//        return ResponseEntity.ok(koiFarms);
//    }

    @PostMapping
    public ResponseEntity<TripDetail> createTripDetail(@RequestBody TripDetail tripDetail) {
        TripDetail createdTripDetail = tripDetailService.createTripDetail(tripDetail);
        return new ResponseEntity<>(createdTripDetail, HttpStatus.CREATED);
    }

    @PutMapping("/{tripDetailId}")
    public ResponseEntity<TripDetail> updateTripDetail(@PathVariable Long tripDetailId, @RequestBody TripDetail tripDetailDetails) {
        TripDetail updatedTripDetail = tripDetailService.updateTripDetail(tripDetailId, tripDetailDetails);
        return new ResponseEntity<>(updatedTripDetail, HttpStatus.OK);
    }

    @DeleteMapping("/{tripDetailId}")
    public ResponseEntity<Void> deleteTripDetail(@PathVariable Long tripDetailId) {
        tripDetailService.deleteTripDetail(tripDetailId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

