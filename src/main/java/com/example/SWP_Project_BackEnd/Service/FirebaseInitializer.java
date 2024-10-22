package com.example.SWP_Project_BackEnd.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Service
public class FirebaseInitializer {

    @PostConstruct
    public void initialize() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("C:\\Users\\ASUS GAMING\\Documents\\FPT University\\FALL 2024\\SWP391\\SWP_Project_BackEnd\\SWP_Project_BackEnd\\koi-trip-system-firebase-adminsdk-i7lk4-8afa605208.json");

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}