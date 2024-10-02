// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmWZzZpXxx8qQINn58fCAB43T8zjMdTmU",
  authDomain: "koi-trip.firebaseapp.com",
  projectId: "koi-trip",
  storageBucket: "koi-trip.appspot.com",
  messagingSenderId: "882173790571",
  appId: "1:882173790571:web:dbf14a38119dfea2ae642e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { storage, googleProvider };
