"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logoutUser } from "@/lib/auth"
import Link from "next/link"
import { getPlayerProfile } from "@/lib/player-service"
import { PlayerProfile } from "@/lib/player-types"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    
    if (user) {
      fetchPlayerProfile()
    }
  }, [user, loading, router])

  const fetchPlayerProfile = async () => {
    setProfileLoading(true)
    try {
      const result = await getPlayerProfile(user.uid)
      if (result.success) {
        setPlayerProfile(result.profile)
      }
    } catch (error) {
      console.error("Error fetching player profile:", error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome, {user.name || "User"}!</CardTitle>
            <CardDescription>This is your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {playerProfile && (
                <>
                  <p>
                    <strong>Skill Level:</strong> {playerProfile.skillLevel.charAt(0).toUpperCase() + playerProfile.skillLevel.slice(1)}
                  </p>
                  <p>
                    <strong>Availability:</strong> {playerProfile.availability.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(", ")}
                  </p>
                  <p>
                    <strong>Status:</strong> {playerProfile.isActive ? "Available for matches" : "Not available for matches"}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
              <CardDescription>Schedule your next coaching session</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/booking">
                <Button>Book Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ladder Rankings</CardTitle>
              <CardDescription>View your current ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/ladder">
                <Button>View Rankings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Profile</CardTitle>
              <CardDescription>Manage your player information</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/player-profile">
                <Button>Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Find Players</CardTitle>
              <CardDescription>Browse and challenge other players</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/player-directory">
                <Button>Find Players</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Match Requests</CardTitle>
              <CardDescription>Manage your match requests and schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/matches">
                <Button>View Matches</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
