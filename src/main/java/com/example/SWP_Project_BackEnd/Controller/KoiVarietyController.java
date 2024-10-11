package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import com.example.SWP_Project_BackEnd.Repository.KoiFishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/koi_variety")
public class KoiVarietyController {

    @Autowired
    private KoiFishRepository koiFishRepository;

    // Get all KoiVariety
    @GetMapping
    public List<KoiVariety> getAllKoiFish() {
        return koiFishRepository.findAll();
    }

    // Get KoiVariety by ID
    @GetMapping("/{id}")
    public ResponseEntity<KoiVariety> getKoiFishById(@PathVariable Long id) {
        Optional<KoiVariety> koiFish = koiFishRepository.findById(id);
        return koiFish.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new KoiVariety
    @PostMapping("/{id}")
    public KoiVariety createKoiFish(@RequestBody KoiVariety koiVariety) {
        return koiFishRepository.save(koiVariety);
    }

    // Update KoiVariety
    @PutMapping("/{id}")
    public ResponseEntity<KoiVariety> updateKoiFish(@PathVariable Long id, @RequestBody KoiVariety koiVarietyDetails) {
        Optional<KoiVariety> koiFish = koiFishRepository.findById(id);

        if (koiFish.isPresent()) {
            KoiVariety updatedKoiVariety = koiFish.get();
            updatedKoiVariety.setVariety_name(koiVarietyDetails.getVariety_name());
            updatedKoiVariety.setKoi_price(koiVarietyDetails.getKoi_price());
            updatedKoiVariety.setDescription(koiVarietyDetails.getDescription());
            updatedKoiVariety.setImageUrl(koiVarietyDetails.getImageUrl());
            KoiVariety savedKoiVariety = koiFishRepository.save(updatedKoiVariety);
            return ResponseEntity.ok(savedKoiVariety);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete KoiVariety
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
