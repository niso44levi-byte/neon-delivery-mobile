// config/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAPdRN2GyvijvDJQip7riqfUvhgVq8pCQ",
  authDomain: "naondelivery-1182d.firebaseapp.com",
  projectId: "naondelivery-1182d",
  storageBucket: "naondelivery-1182d.appspot.com",
  messagingSenderId: "774061795641",
  appId: "1:774061795641:web:f6d0f6cfa1382bdc5460e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (with React Native persistence)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Google Auth provider
const googleProvider = new GoogleAuthProvider();

// OAuth client IDs
const expoClientId = "774061795641-2jvn047291l0h30qenjr863ii6a2khcr.apps.googleusercontent.com";
const androidClientId = "774061795641-8o92m8tukjf7f4eufcnc7og8u8mkdlq2.apps.googleusercontent.com";
const iosClientId = "774061795641-i8onlrfniobb2edlvnuftss4j7rpd5dq.apps.googleusercontent.com";

export {
  auth,
  db,
  googleProvider,
  expoClientId,
  androidClientId,
  iosClientId
};
