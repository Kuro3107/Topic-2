package com.example.SWP_Project_BackEnd.Entity;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "feedbackId")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comments")
    private String comments;

    @Column(name = "customer_id")
    private Long customerId;

    // Nếu cần liên kết với Customer
    @ManyToOne
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    @JsonIgnore
    private Customer customer;
}

