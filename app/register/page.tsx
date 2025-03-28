"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SkillLevel, Availability } from "@/lib/player-types"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.BEGINNER)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleAvailabilityChange = (value: Availability) => {
    setAvailability(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (availability.length === 0) {
        throw new Error("Please select at least one availability option")
      }

      const result = await registerUser(name, email, password)

      if (result.success) {
        // ✅ ✅ ✅ NEW BLOCK
        const userId = result.userId
        if (!userId) {
          throw new Error("User ID not found")
        }

        await setDoc(doc(db, "playerProfiles", userId), {
          userId,
          name,
          email,
          skillLevel,
          availability,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        setSuccess("Player registered successfully")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create a player account</CardTitle>
          <CardDescription>Enter your information to join the squash community</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-
