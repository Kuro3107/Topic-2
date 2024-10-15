package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import com.example.SWP_Project_BackEnd.Service.KoiVarietyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/koi-varieties")
@CrossOrigin(origins = "http://localhost:5173")
public class KoiVarietyController {
    @Autowired
    private KoiVarietyService koiVarietyService;

    @GetMapping
    public List<KoiVariety> getAllKoiVarieties() {
        return koiVarietyService.getAllKoiVarieties();
    }

    @GetMapping("/{id}")
    public KoiVariety getKoiVarietyById(@PathVariable Long id) {
        return koiVarietyService.getKoiVarietyById(id);
    }

    @PostMapping
    public KoiVariety createKoiVariety(@RequestBody KoiVariety koiVariety) {
        return koiVarietyService.createKoiVariety(koiVariety);
    }

    @PutMapping("/{id}")
    public KoiVariety updateKoiVariety(@PathVariable Long id, @RequestBody KoiVariety koiVariety) {
        return koiVarietyService.updateKoiVariety(id, koiVariety);
    }

    @DeleteMapping("/{id}")
    public void deleteKoiVariety(@PathVariable Long id) {
        koiVarietyService.deleteKoiVariety(id);
    }
}

