package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import com.example.SWP_Project_BackEnd.Repository.KoiVarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KoiVarietyService {
    @Autowired
    private KoiVarietyRepository koiVarietyRepository;

    public List<KoiVariety> getAllKoiVarieties() {
        return koiVarietyRepository.findAll();
    }

    public KoiVariety getKoiVarietyById(Integer id) {
        return koiVarietyRepository.findById(id).orElse(null);
    }

    public KoiVariety createKoiVariety(KoiVariety koiVariety) {
        return koiVarietyRepository.save(koiVariety);
    }

    public KoiVariety updateKoiVariety(Integer id, KoiVariety koiVariety) {
        KoiVariety existingVariety = koiVarietyRepository.findById(id).orElse(null);
        if (existingVariety != null) {
            existingVariety.setVarietyName(koiVariety.getVarietyName());
            existingVariety.setDescription(koiVariety.getDescription());
            existingVariety.setImageUrl(koiVariety.getImageUrl());
            existingVariety.setKoiPrice(koiVariety.getKoiPrice());
            return koiVarietyRepository.save(existingVariety);
        }
        return null;
    }

    public void deleteKoiVariety(Integer id) {
        koiVarietyRepository.deleteById(id);
    }
}
