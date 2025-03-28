"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { PlayerProfile, MatchRequest } from "@/lib/player-types"

export default function ChallengePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const playerId = searchParams.get('player')
  
  const [player, setPlayer] = useState<PlayerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    
    if (user && playerId) {
      fetchPlayerDetails()
    } else if (!playerId) {
      setError("No player selected for challenge")
      setIsLoading(false)
    }
  }, [user, loading, router, playerId])

  const fetchPlayerDetails = async () => {
    setIsLoading(true)
    try {
      const playerDoc = await getDoc(doc(db, "playerProfiles", playerId as string))
      
      if (playerDoc.exists()) {
        const playerData = playerDoc.data() as PlayerProfile
        setPlayer(playerData)
      } else {
        setError("Player not found")
      }
    } catch (error: any) {
      setError(`Failed to load player details: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendChallenge = async () => {
    if (!selectedDate) {
      setError("Please select a date for the match")
      return
    }

    setIsSending(true)
    setError("")
    setSuccess("")

    try {
      // Create a new match request in Firestore
      await addDoc(collection(db, "matchRequests"), {
        requesterId: user.uid,
        requesterName: user.name,
        requesterEmail: user.email,
        requesteeId: playerId,
        requesteeName: player?.name,
        requesteeEmail: player?.email,
        status: 'pending',
        proposedDate: selectedDate.toISOString(),
        createdAt: serverTimestamp(),
      })

      setSuccess("Challenge sent successfully")
      
      // Redirect to dashboard after successful challenge
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "An error occurred while sending challenge")
    } finally {
      setIsSending(false)
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

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Challenge Player</h1>
            <Button variant="outline" onClick={() => router.push("/player-directory")}>
              Back to Directory
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertDescription>{error || "No player selected"}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Challenge Player</h1>
          <Button variant="outline" onClick={() => router.push("/player-directory")}>
            Back to Directory
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Challenge {player.name}</CardTitle>
            <CardDescription>Send a match request to this player</CardDescription>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Player Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {player.name}</p>
                  <p><span className="font-medium">Email:</span> {player.email}</p>
                  <p><span className="font-medium">Skill Level:</span> {player.skillLevel.charAt(0).toUpperCase() + player.skillLevel.slice(1)}</p>
                  <p><span className="font-medium">Availability:</span> {player.availability.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(", ")}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Propose a Date</h3>
                <p className="mb-2 text-sm text-gray-500">Select a date for your match</p>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSendChallenge} 
                disabled={isSending || !selectedDate}
              >
                {isSending ? "Sending Challenge..." : "Send Challenge"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
