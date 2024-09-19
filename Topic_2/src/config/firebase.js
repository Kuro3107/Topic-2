// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQBhWtzznh0cpRQkgbX-c_qPkIV5VuTzY",
  authDomain: "koi-trip-65a27.firebaseapp.com",
  projectId: "koi-trip-65a27",
  storageBucket: "koi-trip-65a27.appspot.com",
  messagingSenderId: "741955715628",
  appId: "1:741955715628:web:300120f8fa1fbfb74d8789",
  measurementId: "G-9K6WN3XVD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
