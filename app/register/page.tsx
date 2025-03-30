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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.DIVISION_6)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleAvailabilityChange = (value: Availability) => {
    setAvailability(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate inputs
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      // Validate password
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long")
      }
      if (!/[A-Z]/.test(password)) {
        throw new Error("Password must contain at least one uppercase letter")
      }
      if (!/[a-z]/.test(password)) {
        throw new Error("Password must contain at least one lowercase letter")
      }
      if (!/[0-9]/.test(password)) {
        throw new Error("Password must contain at least one number")
      }
      if (!/[!@#$%^&*]/.test(password)) {
        throw new Error("Password must contain at least one special character (!@#$%^&*)")
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (availability.length === 0) {
        throw new Error("Please select at least one availability option")
      }

      // Register user with Firebase Auth
      const result = await registerUser(name, email, password)

      if (result.success) {
        // Create player profile in Firestore
        try {
          // Check if userId is returned from registerUser
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
          // Redirect to login page after successful registration
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        } catch (profileError: any) {
          setError(`Registration successful but failed to create player profile: ${profileError.message}`)
        }
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
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must contain at least 8 characters, including uppercase, lowercase, 
                number, and special character (!@#$%^&*)
              </p>
              <Label htmlFor="confirm-password" className="mt-4">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <RadioGroup 
                value={skillLevel} 
                onValueChange={(value) => setSkillLevel(value as SkillLevel)}
                className="flex flex-col space-y-3"
              >
                {Object.entries(SkillLevelDescriptions).map(([level, description]) => (
                  <div key={level} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
                    <RadioGroupItem value={level} id={level} />
                    <div>
                      <Label htmlFor={level} className="font-medium">
                        {level.replace('_', ' ').toUpperCase()}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Availability (select all that apply)</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="weekdays" 
                    checked={availability.includes(Availability.WEEKDAYS)}
                    onCheckedChange={() => handleAvailabilityChange(Availability.WEEKDAYS)}
                  />
                  <Label htmlFor="weekdays">Weekdays</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="weekends" 
                    checked={availability.includes(Availability.WEEKENDS)}
                    onCheckedChange={() => handleAvailabilityChange(Availability.WEEKENDS)}
                  />
                  <Label htmlFor="weekends">Weekends</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="evenings" 
                    checked={availability.includes(Availability.EVENINGS)}
                    onCheckedChange={() => handleAvailabilityChange(Availability.EVENINGS)}
                  />
                  <Label htmlFor="evenings">Evenings</Label>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create player account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
