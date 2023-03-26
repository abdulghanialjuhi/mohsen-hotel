import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcy5jAa23d70iZNT_SYANTLWH7SS4BXHI",
  authDomain: "mk-hotel-7a905.firebaseapp.com",
  databaseURL: "https://mk-hotel-7a905-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mk-hotel-7a905",
  storageBucket: "mk-hotel-7a905.appspot.com",
  messagingSenderId: "178081465976",
  appId: "1:178081465976:web:27389ef78486e4e482cf8d",
  measurementId: "G-XSBFTCTYVK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);