// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { initializeAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import AsyncStorage from '@react-native-async-storage/async-storage';


// @ts-ignore - Firebase 12.6.0 has this export but TS definitions may be outdated
import { getReactNativePersistence } from 'firebase/auth';

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

// Initialize Auth (Firebase will use default persistence for React Native)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// Initialize Firestore
export const db = getFirestore(app);

// Initialize Functions
export const functions = getFunctions(app);

// If you want to test with local emulator, uncomment this:
// if (__DEV__) {
//   connectFunctionsEmulator(functions, "localhost", 5001);
// }
