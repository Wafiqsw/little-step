// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Copy this file to index.ts and add your Firebase config
// Get these values from your google-services.json file:
// - apiKey: from client.api_key[0].current_key
// - projectId: from project_info.project_id
// - storageBucket: from project_info.storage_bucket
// - messagingSenderId: from project_info.project_number
// - appId: from client.client_info.mobilesdk_app_id

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
