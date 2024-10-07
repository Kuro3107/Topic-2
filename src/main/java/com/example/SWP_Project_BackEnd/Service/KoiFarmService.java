package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.KoiFarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KoiFarmService {

    @Autowired
    private KoiFarmRepository koiFarmRepository;

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
        existingFarm.setTripDetailId(farmDetails.getTripDetailId());
        existingFarm.setKoiId(farmDetails.getKoiId());
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
}
