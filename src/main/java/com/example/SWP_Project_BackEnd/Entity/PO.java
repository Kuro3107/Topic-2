package com.example.SWP_Project_BackEnd.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "po")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "po_id")
    private Long poId;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "koi_delivery_date")
    private Date koiDeliveryDate;

    @Column(name = "status")
    private String status;

    @Column(name = "address")
    private String address;

    // Liên kết OneToMany với PODetail
    @OneToMany(mappedBy = "po", cascade = CascadeType.ALL)
    @JsonManagedReference // Giữ lại thông tin PO
    private List<PODetail> poDetails;

    public void addPODetail(PODetail poDetail) {
        poDetails.add(poDetail);
        poDetail.setPo(this);
    }

    public void removePODetail(PODetail poDetail) {
        poDetails.remove(poDetail);
        poDetail.setPo(null);
    }
}

