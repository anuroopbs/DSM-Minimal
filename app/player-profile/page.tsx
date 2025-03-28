"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SkillLevel, Availability, PlayerProfile } from "@/lib/player-types"

export default function PlayerProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Form state
  const [name, setName] = useState("")
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.BEGINNER)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    
    if (user) {
      fetchPlayerProfile()
    }
  }, [user, loading, router])

  const fetchPlayerProfile = async () => {
    setIsLoading(true)
    try {
      const profileDoc = await getDoc(doc(db, "playerProfiles", user.uid))
      
      if (profileDoc.exists()) {
        const profileData = profileDoc.data() as PlayerProfile
        setPlayerProfile(profileData)
        
        // Set form state
        setName(profileData.name)
        setSkillLevel(profileData.skillLevel)
        setAvailability(profileData.availability)
        setIsActive(profileData.isActive)
      } else {
        // Create a new profile if it doesn't exist
        const newProfile: PlayerProfile = {
          userId: user.uid,
          name: user.name || "",
          email: user.email || "",
          skillLevel: SkillLevel.BEGINNER,
          availability: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        setPlayerProfile(newProfile)
        setName(newProfile.name)
      }
    } catch (error: any) {
      setError(`Failed to load profile: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

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
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // Validate inputs
      if (availability.length === 0) {
        throw new Error("Please select at least one availability option")
      }

      // Update player profile in Firestore
      await updateDoc(doc(db, "playerProfiles", user.uid), {
        name,
        skillLevel,
        availability,
        isActive,
        updatedAt: new Date().toISOString(),
      })

      setSuccess("Profile updated successfully")
      
      // Refresh profile data
      fetchPlayerProfile()
    } catch (err: any) {
      setError(err.message || "An error occurred while updating profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Player Profile</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Player Profile</CardTitle>
            <CardDescription>Update your player information and preferences</CardDescription>
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
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
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
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked === true)}
                />
                <Label htmlFor="active">Available for matches</Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
