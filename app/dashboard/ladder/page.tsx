"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LadderPage() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = () => {
    setIsRegistering(true)
    // Simulate registration process
    setTimeout(() => {
      setIsRegistering(false)
      setIsRegistered(true)
    }, 1500)
  }

  // Mock data for ladder rankings
  const malePlayers = Array.from({ length: 10 }, (_, i) => ({
    id: `m${i + 1}`,
    name: `John Player ${i + 1}`,
    matches: 20 - i,
    wins: 15 - i,
    losses: 5,
    points: 100 - i * 5,
  }))

  const femalePlayers = Array.from({ length: 10 }, (_, i) => ({
    id: `f${i + 1}`,
    name: `Jane Player ${i + 1}`,
    matches: 18 - i,
    wins: 14 - i,
    losses: 4,
    points: 95 - i * 5,
  }))

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
              <div className="space-y-4">
                <p>
                  Our ladder ranking system allows you to challenge other players and track your progress. Register now
                  to start competing and improving your skills.
                </p>
                <Button onClick={handleRegister} disabled={isRegistering}>
                  {isRegistering ? "Registering..." : "Register for Ladder"}
                </Button>
              </div>
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

        <Tabs defaultValue="male" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="male">Men's Ladder</TabsTrigger>
            <TabsTrigger value="female">Women's Ladder</TabsTrigger>
          </TabsList>
          <TabsContent value="male">
            <Card>
              <CardHeader>
                <CardTitle>Men's Ladder Rankings</CardTitle>
                <CardDescription>Current standings in the men's ladder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Rank</th>
                        <th className="text-left py-3 px-2">Player</th>
                        <th className="text-center py-3 px-2">Matches</th>
                        <th className="text-center py-3 px-2">W/L</th>
                        <th className="text-center py-3 px-2">Points</th>
                        <th className="text-right py-3 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {malePlayers.map((player, index) => (
                        <tr key={player.id} className="border-b last:border-0">
                          <td className="py-3 px-2 font-medium">{index + 1}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span>{player.name}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 px-2">{player.matches}</td>
                          <td className="text-center py-3 px-2">
                            {player.wins}/{player.losses}
                          </td>
                          <td className="text-center py-3 px-2">{player.points}</td>
                          <td className="text-right py-3 px-2">
                            <Button variant="outline" size="sm" disabled={!isRegistered}>
                              Challenge
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="female">
            <Card>
              <CardHeader>
                <CardTitle>Women's Ladder Rankings</CardTitle>
                <CardDescription>Current standings in the women's ladder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Rank</th>
                        <th className="text-left py-3 px-2">Player</th>
                        <th className="text-center py-3 px-2">Matches</th>
                        <th className="text-center py-3 px-2">W/L</th>
                        <th className="text-center py-3 px-2">Points</th>
                        <th className="text-right py-3 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {femalePlayers.map((player, index) => (
                        <tr key={player.id} className="border-b last:border-0">
                          <td className="py-3 px-2 font-medium">{index + 1}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span>{player.name}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 px-2">{player.matches}</td>
                          <td className="text-center py-3 px-2">
                            {player.wins}/{player.losses}
                          </td>
                          <td className="text-center py-3 px-2">{player.points}</td>
                          <td className="text-right py-3 px-2">
                            <Button variant="outline" size="sm" disabled={!isRegistered}>
                              Challenge
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

