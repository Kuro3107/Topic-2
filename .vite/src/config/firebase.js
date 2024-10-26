// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnfEcbABWlludlGaolhm-Q-CSUrx1lP3Q",
  authDomain: "koi-trip-system.firebaseapp.com",
  projectId: "koi-trip-system",
  storageBucket: "koi-trip-system.appspot.com",
  messagingSenderId: "438654238531",
  appId: "1:438654238531:web:7c828c46154bc8bba579f6",
  measurementId: "G-NCYQS4W1HY"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);
export { storage, googleProvider, auth };
