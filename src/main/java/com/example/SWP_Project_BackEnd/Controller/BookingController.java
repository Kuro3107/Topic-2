package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Dto.BookingDTO;
import com.example.SWP_Project_BackEnd.Entity.Booking;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.BookingRepository;
import com.example.SWP_Project_BackEnd.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

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
    public ResponseEntity<Booking> getBookingById(@PathVariable Integer id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    // UPDATE booking by ID
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Integer id, @RequestBody BookingDTO bookingDTO) {
        Booking updatedBooking = bookingService.updateBooking(id, bookingDTO);
        return ResponseEntity.ok(updatedBooking);
    }

    //Update booking with feedback
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBookingFeedback(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (!optionalBooking.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Booking booking = optionalBooking.get();

        // Cập nhật feedbackId, status, xóa consultant
        if (updates.containsKey("feedbackId")) {
            Long newFeedbackId = ((Number) updates.get("feedbackId")).longValue();
            booking.setFeedbackId(newFeedbackId);
        }
        if (updates.containsKey("status")){
            String newStatus = ((String) updates.get("status") );
            booking.setStatus(newStatus);
        }
        if (updates.containsKey("consultant")){
            String newConsultant = ((String) updates.get("consultant") );
            booking.setStatus(newConsultant);
        }

        // Lưu lại booking với feedbackId mới
        bookingRepository.save(booking);

        return ResponseEntity.ok().build();
    }




    // DELETE booking by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-account/{accountId}")
    public ResponseEntity<List<Booking>> getBookingsByAccountId(@PathVariable Integer accountId) {
        List<Booking> bookings = bookingService.findBookingsByAccountId(accountId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Integer bookingId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        try {
            bookingService.updateStatus(bookingId, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update booking status.");
        }
    }

    @PutMapping("{id}/consultant")
    public ResponseEntity<?> updateBookingConsultant(@PathVariable Integer bookingId, @RequestBody Map<String, String> request) {
        String consultant = request.get("consultant");
        try {
            bookingService.updateConsultant(bookingId, consultant); // Gọi service để cập nhật thông tin
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update Consultant.");
        }
    }



}


