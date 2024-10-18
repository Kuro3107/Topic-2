package com.example.SWP_Project_BackEnd.Service;

import com.example.SWP_Project_BackEnd.Entity.Feedback;
import com.example.SWP_Project_BackEnd.Repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    // Get all feedbacks
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    // Get feedback by ID
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id).orElse(null);
    }

    // Create new feedback
    public Feedback createFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    // Update feedback
    public Feedback updateFeedback(Long id, Feedback feedbackDetails) {
        Feedback feedback = getFeedbackById(id);
        if (feedback != null) {
            feedback.setRating(feedbackDetails.getRating());
            feedback.setComments(feedbackDetails.getComments());
            feedback.setCustomerId(feedbackDetails.getCustomerId());
            return feedbackRepository.save(feedback);
        }
        return null;
    }

    // Delete feedback
    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
