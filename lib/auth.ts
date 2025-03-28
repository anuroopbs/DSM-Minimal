"use client"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import bcrypt from "bcryptjs"

// Register a new user
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format")
    }

    // Validate inputs
    if (!name || !email || !password) {
      throw new Error("All fields are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      hashedPassword, // Store hashed password in Firestore
      createdAt: new Date().toISOString(),
    })

    return { success: true, message: "User registered successfully" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      throw new Error("User data not found")
    }

    const userData = userDoc.data()

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword)

    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    return {
      success: true,
      message: "Login successful",
      user: {
        uid: user.uid,
        email: userData.email,
        name: userData.name,
      },
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth)
    return { success: true, message: "Logout successful" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Get current user data
export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe()

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            resolve({
              uid: user.uid,
              email: userData.email,
              name: userData.name,
            })
          } else {
            resolve(null)
          }
        } catch (error) {
          reject(error)
        }
      } else {
        resolve(null)
      }
    }, reject)
  })
}

