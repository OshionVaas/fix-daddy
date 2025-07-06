// backend/firebase.js
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDZgBqjhBT28Gwt75CFQNqfi1lNB3gaVdEg",
  authDomain: "fixdaddyapp.firebaseapp.com",
  projectId: "fixdaddyapp",
  storageBucket: "fixdaddyapp.appspot.com",
  messagingSenderId: "15589251767",
  appId: "1:15589251767:web:9dba1db27b25cd665a2732",
  measurementId: "G-JWJMMH7538"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
