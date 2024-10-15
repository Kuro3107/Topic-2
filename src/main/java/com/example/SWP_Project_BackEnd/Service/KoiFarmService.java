package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.KoiFarmRepository;
import com.example.SWP_Project_BackEnd.Repository.KoiVarietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KoiFarmService {

    @Autowired
    private KoiFarmRepository koiFarmRepository;

    @Autowired
    private KoiVarietyRepository koiVarietyRepository;

    public List<KoiFarm> getAllFarms() {
        return koiFarmRepository.findAll();
    }

    public KoiFarm getFarmById(Long id) {
        return koiFarmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id " + id));
    }


    public KoiFarm createFarm(KoiFarm farm) {
        return koiFarmRepository.save(farm);
    }

    public KoiFarm updateFarm(Long id, KoiFarm farmDetails) {
        KoiFarm existingFarm = getFarmById(id);
        existingFarm.setFarmName(farmDetails.getFarmName());
        existingFarm.setLocation(farmDetails.getLocation());
        existingFarm.setContactInfo(farmDetails.getContactInfo());
        existingFarm.setImageUrl(farmDetails.getImageUrl());
        return koiFarmRepository.save(existingFarm);
    }

    public void deleteFarm(Long id) {
        KoiFarm existingFarm = getFarmById(id);
        koiFarmRepository.delete(existingFarm);
    }
    public List<KoiVariety> getKoiVarietiesForFarm(Long farmId) {
        KoiFarm farm = koiFarmRepository.findById(farmId).orElse(null);
        if (farm != null) {
            return koiVarietyRepository.findByKoiFarms(farm);
        }
        return new ArrayList<>();
    }

}
