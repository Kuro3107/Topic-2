package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Dto.BookingDTO;
import com.example.SWP_Project_BackEnd.Entity.Booking;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // CREATE booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingDTO bookingDTO) {
        Booking booking = bookingService.saveBooking(bookingDTO);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    // READ all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // READ booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    // UPDATE booking by ID
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody BookingDTO bookingDTO) {
        Booking updatedBooking = bookingService.updateBooking(id, bookingDTO);
        return ResponseEntity.ok(updatedBooking);
    }

    // DELETE booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-account/{accountId}")
    public ResponseEntity<List<Booking>> getBookingsByAccountId(@PathVariable Long accountId) {
        List<Booking> bookings = bookingService.findBookingsByAccountId(accountId);
        return ResponseEntity.ok(bookings);
    }

}


