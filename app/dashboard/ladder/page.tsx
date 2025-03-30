"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LadderWidget } from "@/components/ladder-widget"
import { PlayerRegistrationForm } from "@/components/player-registration-form"
import { SkillFilterWrapper } from "@/components/skill-filter-wrapper"

export default function LadderPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("mens")
  const [players, setPlayers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for demonstration
  const mockPlayers = [
    {
      id: "1",
      name: "John Smith",
      avatar: "",
      skillLevel: "intermediate",
      record: { wins: 8, losses: 2 },
      movement: "up",
      gender: "male"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "",
      skillLevel: "advanced",
      record: { wins: 12, losses: 3 },
      movement: "none",
      gender: "female"
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "",
      skillLevel: "beginner",
      record: { wins: 3, losses: 5 },
      movement: "down",
      gender: "male"
    },
    {
      id: "4",
      name: "Emma Wilson",
      avatar: "",
      skillLevel: "intermediate",
      record: { wins: 6, losses: 4 },
      movement: "up",
      gender: "female"
    },
    {
      id: "5",
      name: "David Lee",
      avatar: "",
      skillLevel: "advanced",
      record: { wins: 15, losses: 2 },
      movement: "up",
      gender: "male"
    }
  ]

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setPlayers(mockPlayers)
      setLoading(false)
      
      // Check if user is registered (would normally come from auth/database)
      const userRegistered = localStorage.getItem("ladderRegistered") === "true"
      setIsRegistered(userRegistered)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleRegister = () => {
    setIsRegistering(true)
    // Simulate registration process
    setTimeout(() => {
      setIsRegistered(true)
      setIsRegistering(false)
      localStorage.setItem("ladderRegistered", "true")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Squash Coach</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/dashboard/booking" className="text-sm font-medium hover:underline underline-offset-4">
              Book Session
            </Link>
            <Link href="/dashboard/ladder" className="text-sm font-medium hover:underline underline-offset-4">
              Ladder
            </Link>
            <Link href="/dashboard/profile" className="text-sm font-medium hover:underline underline-offset-4">
              Profile
            </Link>
          </nav>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Log out
          </Button>
        </div>
      </header>
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ladder Rankings</h1>
          <p className="text-muted-foreground">Compete with other players and climb the rankings</p>
        </div>
        
        {!isRegistered && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Join the Ladder Competition</CardTitle>
              <CardDescription>Register to participate in our ladder ranking system</CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerRegistrationForm 
                onRegister={handleRegister} 
                isRegistering={isRegistering}
              />
            </CardContent>
          </Card>
        )}
        
        {isRegistered && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <CardTitle>You're Registered!</CardTitle>
              </div>
              <CardDescription>You are now part of our ladder ranking system</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                You can now challenge other players and participate in matches to improve your ranking. Check the
                rankings below and start challenging players near your level.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Current Rankings</h2>
          <SkillFilterWrapper />
        </div>
        
        <Tabs defaultValue="mens" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="mens">Men's Ladder</TabsTrigger>
            <TabsTrigger value="womens">Women's Ladder</TabsTrigger>
          </TabsList>
          <TabsContent value="mens">
            {loading ? (
              <div className="text-center py-8">Loading rankings...</div>
            ) : (
              <LadderWidget 
                players={players.filter(p => p.gender === "male")}
                showSkillLevel={true}
                showChallengeButtons={isRegistered}
                maxPlayers={20}
              />
            )}
          </TabsContent>
          <TabsContent value="womens">
            {loading ? (
              <div className="text-center py-8">Loading rankings...</div>
            ) : (
              <LadderWidget 
                players={players.filter(p => p.gender === "female")}
                showSkillLevel={true}
                showChallengeButtons={isRegistered}
                maxPlayers={20}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t bg-muted">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Squash Coach. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
