// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC85sReahDXk3CnP_3WXpzIbaWyXtM9IP0",
    authDomain: "cash-flow-29d0b.firebaseapp.com",
    projectId: "cash-flow-29d0b",
    storageBucket: "cash-flow-29d0b.firebasestorage.app",
    messagingSenderId: "621707551722",
    appId: "1:621707551722:web:8797ea52a6ee8d952b8893",
    measurementId: "G-9KGPG3RLSQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider };