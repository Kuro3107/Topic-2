package com.example.SWP_Project_BackEnd.Repository;

import com.example.SWP_Project_BackEnd.Entity.KoiFarm;
import com.example.SWP_Project_BackEnd.Entity.TripDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripDetailRepository extends JpaRepository<TripDetail, Integer> {
    // Phương thức tìm kiếm tất cả TripDetail theo tripId
    List<TripDetail> findByTrip_TripId(Integer tripId);

    // Phương thức tìm kiếm TripDetail theo tripId và mainTopic
    Optional<TripDetail> findByTrip_TripIdAndMainTopic(Integer tripId, String mainTopic);

    // Phương thức tìm kiếm TripDetail theo tripId và tripDetailId
    Optional<TripDetail> findByTrip_TripIdAndTripDetailId(Integer tripId, Integer tripDetailId);
}

