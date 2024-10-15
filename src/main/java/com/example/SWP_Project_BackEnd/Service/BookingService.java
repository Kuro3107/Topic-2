package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Dto.BookingDTO;
import com.example.SWP_Project_BackEnd.Entity.Booking;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // CREATE booking
    public Booking saveBooking(BookingDTO bookingDTO) {
        Booking booking = new Booking();
        booking.setBookingId(bookingDTO.getBookingId());
        booking.setFullname(bookingDTO.getFullname());
        booking.setPhone(bookingDTO.getPhone());
        booking.setEmail(bookingDTO.getEmail());

        // Null check for favoriteFarm and favoriteKoi
        booking.setFavoriteFarm(bookingDTO.getFavoriteFarm() != null ? String.join(", ", bookingDTO.getFavoriteFarm()) : "");
        booking.setFavoriteKoi(bookingDTO.getFavoriteKoi() != null ? String.join(", ", bookingDTO.getFavoriteKoi()) : "");

        booking.setNote(bookingDTO.getNote());
        booking.setStatus(bookingDTO.getStatus());
        booking.setStartDate(bookingDTO.getStartDate());
        booking.setEndDate(bookingDTO.getEndDate());
        booking.setBookingDate(bookingDTO.getBookingDate());

        return bookingRepository.save(booking);
    }

    // READ all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // READ booking by ID
    public Optional<Booking> getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }

    // UPDATE booking
    public Booking updateBooking(Long bookingId, BookingDTO bookingDTO) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);

        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setFullname(bookingDTO.getFullname());
            booking.setPhone(bookingDTO.getPhone());
            booking.setEmail(bookingDTO.getEmail());
            booking.setTripId(bookingDTO.getTripId());

            // Null check for favoriteFarm and favoriteKoi
            booking.setFavoriteFarm(bookingDTO.getFavoriteFarm() != null ? String.join(", ", bookingDTO.getFavoriteFarm()) : "");
            booking.setFavoriteKoi(bookingDTO.getFavoriteKoi() != null ? String.join(", ", bookingDTO.getFavoriteKoi()) : "");

            booking.setNote(bookingDTO.getNote());
            booking.setStatus(bookingDTO.getStatus());
            booking.setStartDate(bookingDTO.getStartDate());
            booking.setEndDate(bookingDTO.getEndDate());

            return bookingRepository.save(booking);
        } else {
            throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);
        }
    }

    // DELETE booking
    public void deleteBooking(Long bookingId) {
        if (bookingRepository.existsById(bookingId)) {
            bookingRepository.deleteById(bookingId);
        } else {
            throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);
        }
    }
    public List<Booking> findBookingsByAccountId(Long accountId) {
        return bookingRepository.findByCustomerAccountId(accountId);
    }

}


