package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiFish;
import com.example.SWP_Project_BackEnd.Repository.KoiFishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/koifish")
public class KoiFishController {

    @Autowired
    private KoiFishRepository koiFishRepository;

    // Get all KoiFish
    @GetMapping
    public List<KoiFish> getAllKoiFish() {
        return koiFishRepository.findAll();
    }

    // Get KoiFish by ID
    @GetMapping("/{id}")
    public ResponseEntity<KoiFish> getKoiFishById(@PathVariable Long id) {
        Optional<KoiFish> koiFish = koiFishRepository.findById(id);
        return koiFish.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new KoiFish
    @PostMapping
    public KoiFish createKoiFish(@RequestBody KoiFish koiFish) {
        return koiFishRepository.save(koiFish);
    }

    // Update KoiFish
    @PutMapping("/{id}")
    public ResponseEntity<KoiFish> updateKoiFish(@PathVariable Long id, @RequestBody KoiFish koiFishDetails) {
        Optional<KoiFish> koiFish = koiFishRepository.findById(id);

        if (koiFish.isPresent()) {
            KoiFish updatedKoiFish = koiFish.get();
            updatedKoiFish.setType(koiFishDetails.getType());
            updatedKoiFish.setKoi_price(koiFishDetails.getKoi_price());
            updatedKoiFish.setSize(koiFishDetails.getSize());
            updatedKoiFish.setVariety_id(koiFishDetails.getVariety_id());
            updatedKoiFish.setImageUrl(koiFishDetails.getImageUrl());

            KoiFish savedKoiFish = koiFishRepository.save(updatedKoiFish);
            return ResponseEntity.ok(savedKoiFish);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete KoiFish
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKoiFish(@PathVariable Long id) {
        if (koiFishRepository.existsById(id)) {
            koiFishRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
