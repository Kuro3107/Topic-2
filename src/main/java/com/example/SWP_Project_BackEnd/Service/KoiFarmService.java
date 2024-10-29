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

    public KoiFarm getFarmById(Integer id) {
        return koiFarmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id " + id));
    }


    public KoiFarm createFarm(KoiFarm farm) {
        return koiFarmRepository.save(farm);
    }

    public KoiFarm updateFarm(Integer id, KoiFarm farmDetails) {
        KoiFarm existingFarm = getFarmById(id);
        existingFarm.setFarmName(farmDetails.getFarmName());
        existingFarm.setLocation(farmDetails.getLocation());
        existingFarm.setContactInfo(farmDetails.getContactInfo());
        existingFarm.setImageUrl(farmDetails.getImageUrl());
        return koiFarmRepository.save(existingFarm);
    }

    public void deleteFarm(Integer id) {
        KoiFarm existingFarm = getFarmById(id);
        koiFarmRepository.delete(existingFarm);
    }
    public List<KoiVariety> getKoiVarietiesForFarm(Integer farmId) {
        KoiFarm farm = koiFarmRepository.findById(farmId).orElse(null);
        if (farm != null) {
            return koiVarietyRepository.findByKoiFarms(farm);
        }
        return new ArrayList<>();
    }

    public void addKoiVarietyToFarm(Integer farmId, Integer varietyId) {
        // Lấy farm và variety từ cơ sở dữ liệu
        KoiFarm farm = koiFarmRepository.findById(farmId)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id " + farmId));
        KoiVariety variety = koiVarietyRepository.findById(varietyId)
                .orElseThrow(() -> new ResourceNotFoundException("Koi variety not found with id " + varietyId));

        // Thêm variety vào farm
        farm.getKoiVarieties().add(variety);
        koiFarmRepository.save(farm);  // Lưu farm để cập nhật bảng trung gian farm_variety
    }


    public KoiVariety updateKoiVarietyInFarm(Integer farmId, Integer varietyId, KoiVariety koiVarietyDetails) {
        KoiVariety existingVariety = koiVarietyRepository.findById(varietyId)
                .orElseThrow(() -> new ResourceNotFoundException("Koi Variety not found with id " + varietyId));

        // Cập nhật chi tiết của variety
        existingVariety.setVarietyName(koiVarietyDetails.getVarietyName());
        existingVariety.setDescription(koiVarietyDetails.getDescription());

        return koiVarietyRepository.save(existingVariety);
    }

    public void removeKoiVarietyFromFarm(Integer farmId, Integer varietyId) {
        // Tìm farm và variety
        KoiFarm farm = getFarmById(farmId);
        KoiVariety variety = koiVarietyRepository.findById(varietyId)
                .orElseThrow(() -> new ResourceNotFoundException("Koi Variety not found with id " + varietyId));

        // Xóa variety khỏi danh sách koi varieties của farm
        farm.getKoiVarieties().remove(variety);

        // Lưu farm để cập nhật thay đổi
        koiFarmRepository.save(farm);
    }

}
