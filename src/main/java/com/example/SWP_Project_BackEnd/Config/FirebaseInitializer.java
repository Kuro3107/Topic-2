//package com.example.SWP_Project_BackEnd.Config;
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.FirebaseOptions;
//import com.google.firebase.auth.FirebaseAuth;
//
//import java.io.FileInputStream;
//import java.io.IOException;
//
//public class FirebaseInitializer {
//    public static void initializeFirebase() {
//        try {
//            FileInputStream serviceAccount =
//                    new FileInputStream("C:\\Users\\ASUS GAMING\\Documents\\FPT University\\FALL 2024\\SWP391\\SWP_Project_BackEnd\\SWP_Project_BackEnd\\koi-trip-system-firebase-adminsdk-i7lk4-8afa605208.json");
//
//            FirebaseOptions options = new FirebaseOptions.Builder()
//                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                    .build();
//
//            FirebaseApp.initializeApp(options);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//}
//
