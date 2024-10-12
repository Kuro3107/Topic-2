package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.Booking;
import com.example.SWP_Project_BackEnd.Entity.BookingPayment;
import com.example.SWP_Project_BackEnd.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/{bookingId}")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking createdBooking = bookingService.createBooking(booking);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @PostMapping("/{bookingId}/payment")
    public ResponseEntity<BookingPayment> initiatePayment(@PathVariable Long bookingId,
                                                          @RequestParam String methodName,
                                                          @RequestParam String description,
                                                          @RequestParam int amount) {
        BookingPayment bookingPayment = bookingService.initiatePayment(bookingId, methodName, description, amount);
        return new ResponseEntity<>(bookingPayment, HttpStatus.OK);
    }

    @PostMapping("/{bookingId}/payment/{bookingPaymentId}/complete")
    public ResponseEntity<Booking> completePayment(@PathVariable Long bookingId,
                                                   @PathVariable Long bookingPaymentId,
                                                   @RequestParam boolean success) {
        Booking updatedBooking = bookingService.completePayment(bookingId, bookingPaymentId, success);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }
}

