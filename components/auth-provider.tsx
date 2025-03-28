"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface User {
  uid: string
  email: string | null
  name: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name || null,
            })
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: null,
            })
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

