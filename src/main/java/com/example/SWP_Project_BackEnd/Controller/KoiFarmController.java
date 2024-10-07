package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Service.KoiFarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class KoiFarmController {

    @Autowired
    private KoiFarmService koiFarmService;

    @GetMapping
    public List<KoiFarm> getAllFarms() {
        return koiFarmService.getAllFarms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<KoiFarm> getFarmById(@PathVariable Long id) {
        KoiFarm farm = koiFarmService.getFarmById(id);
        return ResponseEntity.ok(farm);
    }

    @PostMapping
    public ResponseEntity<KoiFarm> createFarm(@RequestBody KoiFarm farm) {
        KoiFarm newFarm = koiFarmService.createFarm(farm);
        return new ResponseEntity<>(newFarm, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KoiFarm> updateFarm(@PathVariable Long id, @RequestBody KoiFarm farmDetails) {
        KoiFarm updatedFarm = koiFarmService.updateFarm(id, farmDetails);
        return ResponseEntity.ok(updatedFarm);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarm(@PathVariable Long id) {
        koiFarmService.deleteFarm(id);
        return ResponseEntity.noContent().build();
    }
}
