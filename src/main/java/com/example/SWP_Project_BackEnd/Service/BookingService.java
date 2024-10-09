package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.Booking;
import com.example.SWP_Project_BackEnd.Entity.BookingPayment;
import com.example.SWP_Project_BackEnd.Entity.POPayment;
import com.example.SWP_Project_BackEnd.Entity.PaymentMethod;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.BookingPaymentRepository;
import com.example.SWP_Project_BackEnd.Repository.BookingRepository;
import com.example.SWP_Project_BackEnd.Repository.POPaymentRepository;
import com.example.SWP_Project_BackEnd.Repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BookingPaymentRepository bookingPaymentRepository;
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;
    @Autowired
    private POPaymentRepository poPaymentRepository;

    public Booking createBooking(Booking booking) {
        booking.setStatus("Pending Payment");
        booking.setBookingDate(LocalDate.now());
        return bookingRepository.save(booking);
    }

    public BookingPayment initiatePayment(Long bookingId, String methodName, String description, int amount) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        BookingPayment bookingPayment = new BookingPayment();
        bookingPayment.setStatus("Pending");
        bookingPayment = bookingPaymentRepository.save(bookingPayment);

        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setBookingPaymentId(bookingPayment.getBookingPaymentId());
        paymentMethod.setMethodName(methodName);
        paymentMethod.setDescription(description);
        paymentMethodRepository.save(paymentMethod);

        POPayment poPayment = new POPayment();
        poPayment.setAmount(amount);
        poPaymentRepository.save(poPayment);

        booking.setBookingPaymentId(bookingPayment.getBookingPaymentId());
        bookingRepository.save(booking);

        return bookingPayment;
    }

    public Booking completePayment(Long bookingId, Long bookingPaymentId, boolean success) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        BookingPayment bookingPayment = bookingPaymentRepository.findById(bookingPaymentId).orElseThrow(() -> new ResourceNotFoundException("BookingPayment not found"));

        if (success) {
            bookingPayment.setStatus("Completed");
            booking.setStatus("Paid");
            booking.setQuoteApprovedDate(LocalDate.now());
        } else {
            bookingPayment.setStatus("Failed");
            booking.setStatus("Payment Failed");
        }

        bookingPaymentRepository.save(bookingPayment);
        return bookingRepository.save(booking);
    }
}

