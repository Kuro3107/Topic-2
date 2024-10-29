package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import com.example.SWP_Project_BackEnd.Service.KoiFarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "http://localhost:5173")
public class KoiFarmController {

    @Autowired
    private KoiFarmService koiFarmService;

    @GetMapping
    public List<KoiFarm> getAllFarms() {
        return koiFarmService.getAllFarms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KoiFarm> getFarmById(@PathVariable Integer id) {
        KoiFarm farm = koiFarmService.getFarmById(id);
        return ResponseEntity.ok(farm);
    }

    @PostMapping
    public ResponseEntity<KoiFarm> createFarm(@RequestBody KoiFarm farm) {
        KoiFarm newFarm = koiFarmService.createFarm(farm);
        return new ResponseEntity<>(newFarm, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KoiFarm> updateFarm(@PathVariable Integer id, @RequestBody KoiFarm farmDetails) {
        KoiFarm updatedFarm = koiFarmService.updateFarm(id, farmDetails);
        return ResponseEntity.ok(updatedFarm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable Integer id) {
        koiFarmService.deleteFarm(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/koi-varieties")
    public List<KoiVariety> getKoiVarietiesForFarm(@PathVariable Integer id) {
        return koiFarmService.getKoiVarietiesForFarm(id);
    }

    @PostMapping("/{id}/koi-varieties")
    public ResponseEntity<Void> addKoiVarietyToFarm(@PathVariable Integer id, @RequestBody Map<String, Integer> payload) {
        Integer varietyId = payload.get("varietyId");  // Lấy varietyId từ payload
        koiFarmService.addKoiVarietyToFarm(id, varietyId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }



    @PutMapping("/{id}/koi-varieties/{varietyId}")
    public ResponseEntity<KoiVariety> updateKoiVarietyInFarm(@PathVariable Integer id, @PathVariable Integer varietyId, @RequestBody KoiVariety koiVarietyDetails) {
        KoiVariety updatedVariety = koiFarmService.updateKoiVarietyInFarm(id, varietyId, koiVarietyDetails);
        return ResponseEntity.ok(updatedVariety);
    }

    @DeleteMapping("/{id}/koi-varieties/{varietyId}")
    public ResponseEntity<Void> removeKoiVarietyFromFarm(@PathVariable Integer id, @PathVariable Integer varietyId) {
        koiFarmService.removeKoiVarietyFromFarm(id, varietyId);
        return ResponseEntity.noContent().build();
    }
}
