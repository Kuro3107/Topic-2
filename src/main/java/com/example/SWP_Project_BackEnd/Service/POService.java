package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.Booking;
import com.example.SWP_Project_BackEnd.Entity.PO;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.PORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class POService {

    @Autowired
    private PORepository poRepository;

    @Autowired
    private BookingService bookingService;

    @Transactional
    public PO createPOForBooking(Long bookingId, PO po) {
        // Lưu PO mới
        PO savedPO = poRepository.save(po);

        // Lấy Booking bằng ID
        Optional<Booking> optionalBooking = bookingService.getBookingById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setPoId(savedPO.getPoId());  // Cập nhật PO_ID
            bookingService.updatePoId(bookingId, savedPO.getPoId());  // Gọi phương thức mới
        }

        return savedPO;
    }

    // CREATE PO
    public PO createPO(PO po) {
        return poRepository.save(po);
    }

    // READ PO by ID
    public Optional<PO> getPOById(Long poId) {
        return poRepository.findById(poId);
    }

    // READ ALL POs
    public List<PO> getAllPOs() {
        return poRepository.findAll();
    }

    // UPDATE PO
    public PO updatePO(Long poId, PO updatedPO) {
        Optional<PO> optionalPO = poRepository.findById(poId);
        if (optionalPO.isPresent()) {
            PO existingPO = optionalPO.get();
            existingPO.setTotalAmount(updatedPO.getTotalAmount());
            existingPO.setKoiDeliveryDate(updatedPO.getKoiDeliveryDate());
            existingPO.setStatus(updatedPO.getStatus());

            return poRepository.save(existingPO);
        } else {
            throw new ResourceNotFoundException("PO not found with ID: " + poId);
        }
    }

    // DELETE PO
    public void deletePO(Long poId) {
        poRepository.deleteById(poId);
    }
}

