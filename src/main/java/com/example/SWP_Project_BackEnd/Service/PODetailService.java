package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.PO;
import com.example.SWP_Project_BackEnd.Entity.PODetail;
import com.example.SWP_Project_BackEnd.Exception.ResourceNotFoundException;
import com.example.SWP_Project_BackEnd.Repository.PODetailRepository;
import com.example.SWP_Project_BackEnd.Repository.PORepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PODetailService {

    @Autowired
    private PODetailRepository poDetailRepository;

    @Autowired
    private PORepository poRepository;

    public PODetail createPODetail(Long poId, PODetail poDetail) {
        Optional<PO> optionalPO = poRepository.findById(poId);
        if (optionalPO.isPresent()) {
            poDetail.setPo(optionalPO.get());
            return poDetailRepository.save(poDetail);
        } else {
            throw new ResourceNotFoundException("PO not found with id " + poId);
        }
    }

    public List<PODetail> getPODetailsByPOId(Long poId) {
        return poDetailRepository.findByPoPoId(poId);
    }

    public PODetail updatePODetail(Long poDetailId, PODetail updatedPODetail) {
        Optional<PODetail> optionalPODetail = poDetailRepository.findById(poDetailId);

        if (optionalPODetail.isPresent()) {
            PODetail existingPODetail = optionalPODetail.get();
            existingPODetail.setVariety(updatedPODetail.getVariety());
            existingPODetail.setFarm(updatedPODetail.getFarm());
            existingPODetail.setDeposit(updatedPODetail.getDeposit());
            existingPODetail.setTotalKoiPrice(updatedPODetail.getTotalKoiPrice());
            existingPODetail.setRemainingPrice(updatedPODetail.getRemainingPrice());
            existingPODetail.setQuantity(updatedPODetail.getQuantity());
            existingPODetail.setImageUrl(updatedPODetail.getImageUrl());
            existingPODetail.setDay(updatedPODetail.getDay());

            return poDetailRepository.save(existingPODetail);
        } else {
            throw new ResourceNotFoundException("PODetail not found with id " + poDetailId);
        }
    }

    public void deletePODetail(Long poDetailId) {
        poDetailRepository.deleteById(poDetailId);
    }
}


