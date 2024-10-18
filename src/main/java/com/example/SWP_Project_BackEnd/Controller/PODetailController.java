package com.example.SWP_Project_BackEnd.Controller;

import com.example.SWP_Project_BackEnd.Entity.PODetail;
import com.example.SWP_Project_BackEnd.Service.PODetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/podetails")
@CrossOrigin(origins = "http://localhost:5173")
public class PODetailController {

    @Autowired
    private PODetailService poDetailService;

    @PostMapping("/po/{poId}")
    public ResponseEntity<PODetail> createPODetail(@PathVariable Long poId, @RequestBody PODetail poDetail) {
        PODetail createdPODetail = poDetailService.createPODetail(poId, poDetail);
        return new ResponseEntity<>(createdPODetail, HttpStatus.CREATED);
    }

    @GetMapping("/po/{poId}")
    public List<PODetail> getPODetailsByPOId(@PathVariable Long poId) {
        return poDetailService.getPODetailsByPOId(poId);
    }

    @PutMapping("/{poDetailId}")
    public ResponseEntity<PODetail> updatePODetail(@PathVariable Long poDetailId, @RequestBody PODetail poDetail) {
        PODetail updatedPODetail = poDetailService.updatePODetail(poDetailId, poDetail);
        return new ResponseEntity<>(updatedPODetail, HttpStatus.OK);
    }

    @DeleteMapping("/{poDetailId}")
    public ResponseEntity<Void> deletePODetail(@PathVariable Long poDetailId) {
        poDetailService.deletePODetail(poDetailId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

