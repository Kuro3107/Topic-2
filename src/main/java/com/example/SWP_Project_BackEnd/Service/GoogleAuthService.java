package com.example.SWP_Project_BackEnd.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class GoogleAuthService {

    // Method to verify Google token and return user email
    public String verifyGoogleToken(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        return decodedToken.getEmail(); // Extract the email from the decoded token
    }
}
