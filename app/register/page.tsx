"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser } from "@/lib/auth"
import { SkillLevel, SkillLevelDescriptions } from "@/lib/player-types"
import Link from "next/link";


export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [skillLevel, setSkillLevel] = useState<SkillLevel | "">("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (!email || !password || !confirmPassword || !name || !skillLevel) {
        throw new Error("All fields are required")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      await registerUser(email, password, name, skillLevel as SkillLevel)
      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create a player account</CardTitle>
          <CardDescription>Enter your details to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Password must be at least 6 characters long and contain only letters and numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-level">Skill Level</Label>
              <Select value={skillLevel} onValueChange={(value) => setSkillLevel(value as SkillLevel)}>
                <SelectTrigger className="w-full h-auto py-2">
                  <SelectValue placeholder="Select your skill level" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {Object.entries(SkillLevelDescriptions).map(([level, description]) => (
                    <SelectItem 
                      key={level} 
                      value={level}
                      className="py-3 px-2 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          {level.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500 leading-snug">
                          {description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}