import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDCVYPI3lS2gfBnKzPc0udxMTkhL0jKy8c",
  authDomain: "dublinsportsmentor---minimal.firebaseapp.com",
  projectId: "dublinsportsmentor---minimal",
  storageBucket: "dublinsportsmentor---minimal.firebasestorage.app",
  messagingSenderId: "27938496397",
  appId: "1:27938496397:web:07747ea2113f72d58627c4",
  measurementId: "G-YCKFV85W5K",
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }

