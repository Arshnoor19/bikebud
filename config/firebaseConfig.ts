// config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration (Replace with your actual Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyCJyKHvXgpb2wNuqtoZFIAo7Ykl8QDpOEU",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "try2-9a24c",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
