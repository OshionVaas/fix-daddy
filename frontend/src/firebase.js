// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZgBqjhBT28Gwt75CFQNqfilNB3gaVdEg",
  authDomain: "fixdaddyapp.firebaseapp.com",
  projectId: "fixdaddyapp",
  storageBucket: "fixdaddyapp.appspot.com",
  messagingSenderId: "155829251767",
  appId: "1:155829251767:web:9dba1db27b25cd665a2732",
  measurementId: "G-JWJMMH7538",
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore & Auth
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Export Firestore and Auth for use in other parts of your app
export { db, auth };
