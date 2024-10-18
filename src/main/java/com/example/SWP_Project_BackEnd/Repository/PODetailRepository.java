package com.example.SWP_Project_BackEnd.Repository;

import com.example.SWP_Project_BackEnd.Entity.PO;
import com.example.SWP_Project_BackEnd.Entity.PODetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PODetailRepository extends JpaRepository<PODetail, Long> {
    List<PODetail> findByPoPoId(Long poId);
}

