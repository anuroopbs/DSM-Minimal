"use client"

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCVYPI3lS2gfBnKzPc0udxMTkhL0jKy8c",
  authDomain: "dublinsportsmentor---minimal.firebaseapp.com",
  projectId: "dublinsportsmentor---minimal",
  storageBucket: "dublinsportsmentor---minimal.firebasestorage.app",
  messagingSenderId: "27938496397",
  appId: "1:27938496397:web:07747ea2113f72d58627c4",
  measurementId: "G-YCKFV85W5K",
}

// Initialize Firebase only on the client side
let app
let auth
let db

// Only initialize Firebase if we're in the browser
if (typeof window !== "undefined") {
  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig)

    // Initialize Firebase services
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export { app, auth, db }

