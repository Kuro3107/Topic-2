package com.example.SWP_Project_BackEnd.Repository;

import com.example.SWP_Project_BackEnd.Entity.KoiVariety;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KoiFishRepository extends JpaRepository<KoiVariety, Long> {
}
