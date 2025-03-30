
"use client"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification as firebaseSendEmailVerification } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

// Register a new user
export async function registerUser(name: string, email: string, password: string) {
  if (!auth || !db) {
    throw new Error("Firebase not initialized")
  }

  try {
    // Validate inputs
    if (!name || !email || !password) {
      throw new Error("All fields are required")
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format")
    }

    // Password validation
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user) {
      throw new Error("Failed to create user")
    }

    // Send verification email
    try {
      await firebaseSendEmailVerification(user)
    } catch (error) {
      console.error("Error sending verification email:", error)
      // Continue with registration even if email verification fails
    }

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      emailVerified: false
    })

    return {
      success: true,
      message: "Registration successful. Please check your email for verification.",
      userId: user.uid
    }
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("Email already registered")
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error("Invalid email format")
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error("Email/password accounts are not enabled")
    }
    if (error.code === 'auth/weak-password') {
      throw new Error("Password is too weak")
    }
    
    throw error
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  if (!auth || !db) {
    throw new Error("Firebase not initialized")
  }

  try {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user) {
      throw new Error("Login failed")
    }

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))
    
    if (!userDoc.exists()) {
      throw new Error("User data not found")
    }

    const userData = userDoc.data()

    return {
      success: true,
      message: "Login successful",
      user: {
        uid: user.uid,
        email: userData.email,
        name: userData.name,
        emailVerified: user.emailVerified
      }
    }
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      throw new Error("User not found")
    }
    if (error.code === 'auth/wrong-password') {
      throw new Error("Invalid password")
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error("Invalid email format") 
    }
    if (error.code === 'auth/user-disabled') {
      throw new Error("Account has been disabled")
    }
    
    throw error
  }
}

// Logout user
export async function logoutUser() {
  if (!auth) {
    throw new Error("Firebase not initialized")
  }

  try {
    await signOut(auth)
    return { success: true, message: "Logout successful" }
  } catch (error) {
    throw new Error("Logout failed")
  }
}

// Get current user data
export async function getCurrentUser() {
  if (!auth || !db) {
    throw new Error("Firebase not initialized")
  }

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
              emailVerified: user.emailVerified
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
