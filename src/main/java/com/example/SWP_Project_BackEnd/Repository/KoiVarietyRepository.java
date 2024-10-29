package com.example.SWP_Project_BackEnd.Repository;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KoiVarietyRepository extends JpaRepository<KoiVariety, Integer> {
    List<KoiVariety> findByKoiFarms(KoiFarm koiFarm);
}
