"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillLevelBadge } from "@/components/skill-level-badge"
import { PlayerProfile } from "@/lib/player-types"
import { getAllPlayers } from "@/lib/player-service"
import { PlayerRegistrationForm } from "@/components/player-registration-form"
import { SkillFilterWrapper } from "@/components/skill-filter-wrapper"


export default function LadderPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState<PlayerProfile[]>([])

  useEffect(() => {
    const fetchPlayers = async () => {
      const result = await getAllPlayers()
      if (result.success) {
        // Sort players by ranking/points
        const sortedPlayers = result.players.sort((a, b) => (b.points || 0) - (a.points || 0))
        setPlayers(sortedPlayers)
      }
      setLoading(false)
    }
    // Simulate loading data
    const timer = setTimeout(() => {
      fetchPlayers();
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="all">All Players</TabsTrigger>
            <TabsTrigger value="active">Active Players</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Current Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading rankings...</div>
                  ) : (
                    players.map((player, index) => (
                      <div key={player.userId} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold w-8">{index + 1}</span>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <div className="flex items-center gap-2">
                              <SkillLevelBadge skillLevel={player.skillLevel} />
                              <span className="text-sm text-muted-foreground">
                                {player.wins}W - {player.losses}L
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{player.points || 0} pts</p>
                          <p className="text-sm text-muted-foreground">
                            {player.matchesPlayed || 0} matches
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">Loading rankings...</div>
                  ) : (
                    players.filter(p => p.isActive).map((player, index) => (
                      <div key={player.userId} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold w-8">{index + 1}</span>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <div className="flex items-center gap-2">
                              <SkillLevelBadge skillLevel={player.skillLevel} />
                              <span className="text-sm text-muted-foreground">
                                {player.wins}W - {player.losses}L
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{player.points || 0} pts</p>
                          <p className="text-sm text-muted-foreground">
                            {player.matchesPlayed || 0} matches
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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