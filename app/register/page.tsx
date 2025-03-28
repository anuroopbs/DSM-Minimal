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
              <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
            </div>
            
            <div className="space-y-2">
              <Label>Skill Level</Label>
              <RadioGroup 
                value={skillLevel} 
                onValueChange={(value) => setSkillLevel(value as SkillLevel)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SkillLevel.BEGINNER} id="beginner" />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SkillLevel.INTERMEDIATE} id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SkillLevel.ADVANCED} id="advanced" />
                  <Label htmlFor="advanced">Advanced</Label>
                </div>
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
