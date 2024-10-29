package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.PO;
import com.example.SWP_Project_BackEnd.Service.POService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "http://localhost:5173")
public class POController {

    @Autowired
    private POService poService;

    // Tạo PO mới và gán nó cho Booking
    @PostMapping("/{bookingId}")
    public PO createPOForBooking(@PathVariable Integer bookingId, @RequestBody PO po) {
        return poService.createPOForBooking(bookingId, po);
    }

    // CREATE PO
    @PostMapping
    public PO createPO(@RequestBody PO po) {
        return poService.createPO(po);
    }

    // READ PO by ID
    @GetMapping("/{poId}")
    public Optional<PO> getPOById(@PathVariable Integer poId) {
        return poService.getPOById(poId);
    }

    // READ ALL POs
    @GetMapping
    public List<PO> getAllPOs() {
        return poService.getAllPOs();
    }

    // UPDATE PO
    @PutMapping("/{poId}")
    public PO updatePO(@PathVariable Integer poId, @RequestBody PO po) {
        return poService.updatePO(poId, po);
    }

    // DELETE PO
    @DeleteMapping("/{poId}")
    public ResponseEntity<?> deletePO(@PathVariable Integer poId) {
        poService.deletePO(poId);
        return ResponseEntity.ok("PO deleted successfully");
    }
}

