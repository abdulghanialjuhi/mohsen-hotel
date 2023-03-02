import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6zrqztpiNAqsU5AHF6fCksNA6RgSlF5k",
  authDomain: "mk-hotel.firebaseapp.com",
  databaseURL: "https://mk-hotel-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mk-hotel",
  storageBucket: "mk-hotel.appspot.com",
  messagingSenderId: "854792474553",
  appId: "1:854792474553:web:aa2a76f1cb5dcb0020b068"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);