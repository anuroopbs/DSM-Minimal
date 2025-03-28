"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from "date-fns"

interface MatchRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesteeId: string;
  requesteeName: string;
  requesteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  proposedDate: string;
  createdAt: any;
}

interface Match {
  id: string;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  date: string;
  result?: {
    winner: string;
    score: string;
  };
  createdAt: any;
}

export default function MatchesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [incomingRequests, setIncomingRequests] = useState<MatchRequest[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<MatchRequest[]>([])
  const [scheduledMatches, setScheduledMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    
    if (user) {
      fetchMatchRequests()
      fetchScheduledMatches()
    }
  }, [user, loading, router])

  const fetchMatchRequests = async () => {
    setIsLoading(true)
    try {
      // Fetch incoming requests
      const incomingQuery = query(
        collection(db, "matchRequests"),
        where("requesteeId", "==", user.uid),
        where("status", "==", "pending")
      )
      
      const incomingSnapshot = await getDocs(incomingQuery)
      const incomingData: MatchRequest[] = []
      
      incomingSnapshot.forEach((doc) => {
        incomingData.push({
          id: doc.id,
          ...doc.data() as Omit<MatchRequest, 'id'>
        })
      })
      
      setIncomingRequests(incomingData)
      
      // Fetch outgoing requests
      const outgoingQuery = query(
        collection(db, "matchRequests"),
        where("requesterId", "==", user.uid)
      )
      
      const outgoingSnapshot = await getDocs(outgoingQuery)
      const outgoingData: MatchRequest[] = []
      
      outgoingSnapshot.forEach((doc) => {
        outgoingData.push({
          id: doc.id,
          ...doc.data() as Omit<MatchRequest, 'id'>
        })
      })
      
      setOutgoingRequests(outgoingData)
    } catch (error: any) {
      setError(`Failed to load match requests: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchScheduledMatches = async () => {
    try {
      // Fetch matches where user is player1
      const player1Query = query(
        collection(db, "matches"),
        where("player1Id", "==", user.uid)
      )
      
      const player1Snapshot = await getDocs(player1Query)
      const player1Matches: Match[] = []
      
      player1Snapshot.forEach((doc) => {
        player1Matches.push({
          id: doc.id,
          ...doc.data() as Omit<Match, 'id'>
        })
      })
      
      // Fetch matches where user is player2
      const player2Query = query(
        collection(db, "matches"),
        where("player2Id", "==", user.uid)
      )
      
      const player2Snapshot = await getDocs(player2Query)
      const player2Matches: Match[] = []
      
      player2Snapshot.forEach((doc) => {
        player2Matches.push({
          id: doc.id,
          ...doc.data() as Omit<Match, 'id'>
        })
      })
      
      // Combine and sort by date
      const allMatches = [...player1Matches, ...player2Matches]
      allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      setScheduledMatches(allMatches)
    } catch (error: any) {
      setError(`Failed to load scheduled matches: ${error.message}`)
    }
  }

  const handleAcceptRequest = async (requestId: string, request: MatchRequest) => {
    setIsProcessing(true)
    setError("")
    setSuccess("")
    
    try {
      // Update request status to accepted
      await updateDoc(doc(db, "matchRequests", requestId), {
        status: "accepted"
      })
      
      // Create a new match in the matches collection
      await addDoc(collection(db, "matches"), {
        player1Id: request.requesterId,
        player1Name: request.requesterName,
        player2Id: request.requesteeId,
        player2Name: request.requesteeName,
        date: request.proposedDate,
        createdAt: serverTimestamp()
      })
      
      setSuccess("Match request accepted and scheduled")
      
      // Refresh data
      fetchMatchRequests()
      fetchScheduledMatches()
    } catch (err: any) {
      setError(err.message || "An error occurred while accepting the request")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    setIsProcessing(true)
    setError("")
    setSuccess("")
    
    try {
      // Update request status to declined
      await updateDoc(doc(db, "matchRequests", requestId), {
        status: "declined"
      })
      
      setSuccess("Match request declined")
      
      // Refresh data
      fetchMatchRequests()
    } catch (err: any) {
      setError(err.message || "An error occurred while declining the request")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    setIsProcessing(true)
    setError("")
    setSuccess("")
    
    try {
      // Delete the request
      await deleteDoc(doc(db, "matchRequests", requestId))
      
      setSuccess("Match request cancelled")
      
      // Refresh data
      fetchMatchRequests()
    } catch (err: any) {
      setError(err.message || "An error occurred while cancelling the request")
    } finally {
      setIsProcessing(false)
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
          <h1 className="text-2xl font-bold">Match Requests & Schedule</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

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

        <Tabs defaultValue="incoming" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="incoming">
              Incoming Requests
              {incomingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">{incomingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="outgoing">
              Outgoing Requests
              {outgoingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">{outgoingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled Matches
              {scheduledMatches.length > 0 && (
                <Badge variant="secondary" className="ml-2">{scheduledMatches.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="incoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Match Requests</CardTitle>
                <CardDescription>Requests from other players to schedule a match</CardDescription>
              </CardHeader>
              <CardContent>
                {incomingRequests.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No incoming match requests</p>
                ) : (
                  <div className="space-y-4">
                    {incomingRequests.map((request) => (
                      <Card key={request.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{request.requesterName}</h3>
                              <p className="text-sm text-gray-500">{request.requesterEmail}</p>
                            </div>
                            <Badge>Pending</Badge>
                          </div>
                          <p className="mb-2">
                            <span className="font-medium">Proposed Date:</span>{" "}
                            {format(new Date(request.proposedDate), "PPP")}
                          </p>
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleAcceptRequest(request.id, request)}
                              disabled={isProcessing}
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeclineRequest(request.id)}
                              disabled={isProcessing}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outgoing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Outgoing Match Requests</CardTitle>
                <CardDescription>Requests you've sent to other players</CardDescription>
              </CardHeader>
              <CardContent>
                {outgoingRequests.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No outgoing match requests</p>
                ) : (
                  <div className="space-y-4">
                    {outgoingRequests.map((request) => (
                      <Card key={request.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">To: {request.requesteeName}</h3>
                              <p className="text-sm text-gray-500">{request.requesteeEmail}</p>
                            </div>
                            <Badge 
                              variant={
                                request.status === "pending" ? "secondary" : 
                                request.status === "accepted" ? "success" : "destructive"
                              }
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="mb-2">
                            <span className="font-medium">Proposed Date:</span>{" "}
                            {format(new Date(request.proposedDate), "PPP")}
                          </p>
                          {request.status === "pending" && (
                            <div className="flex space-x-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleCancelRequest(request.id)}
                                disabled={isProcessing}
                              >
                                Cancel Request
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Matches</CardTitle>
                <CardDescription>Your upcoming and past matches</CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledMatches.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No scheduled matches</p>
                ) : (
                  <div className="space-y-4">
                    {scheduledMatches.map((match) => {
                      const isUpcoming = new Date(match.date) > new Date()
                      const opponent = match.player1Id === user.uid ? match.player2Name : match.player1Name
                      
                      return (
                        <Card key={match.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">Match with {opponent}</h3>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(match.date), "PPP")}
                                </p>
                              </div>
                              <Badge variant={isUpcoming ? "secondary" : "outline"}>
                                {isUpcoming ? "Upcoming" : "Past"}
                              </Badge>
                            </div>
                            
                            {match.result && (
                              <div className="mt-2 p-2 bg-gray-50 rounded">
                                <p className="font-medium">Result:</p>
                                <p>Winner: {match.result.winner}</p>
                                <p>Score: {match.result.score}</p>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <Button onClick={() => router.push("/player-directory")}>
            Find Players to Challenge
          </Button>
        </div>
      </div>
    </div>
  )
}
