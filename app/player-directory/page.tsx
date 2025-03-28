"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SkillLevel, Availability, PlayerProfile } from "@/lib/player-types"

export default function PlayerDirectoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [players, setPlayers] = useState<PlayerProfile[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Filter state
  const [skillLevelFilter, setSkillLevelFilter] = useState<string>("all")
  const [availabilityFilters, setAvailabilityFilters] = useState<Availability[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyActive, setShowOnlyActive] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    
    if (user) {
      fetchPlayers()
    }
  }, [user, loading, router])

  useEffect(() => {
    applyFilters()
  }, [players, skillLevelFilter, availabilityFilters, searchTerm, showOnlyActive])

  const fetchPlayers = async () => {
    setIsLoading(true)
    try {
      const playersQuery = query(collection(db, "playerProfiles"))
      const querySnapshot = await getDocs(playersQuery)
      
      const playersList: PlayerProfile[] = []
      querySnapshot.forEach((doc) => {
        const playerData = doc.data() as PlayerProfile
        // Don't include the current user in the list
        if (playerData.userId !== user.uid) {
          playersList.push(playerData)
        }
      })
      
      setPlayers(playersList)
      setFilteredPlayers(playersList)
    } catch (error: any) {
      setError(`Failed to load players: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvailabilityFilterChange = (value: Availability) => {
    setAvailabilityFilters(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const applyFilters = () => {
    let result = [...players]
    
    // Filter by active status
    if (showOnlyActive) {
      result = result.filter(player => player.isActive)
    }
    
    // Filter by skill level
    if (skillLevelFilter !== "all") {
      result = result.filter(player => player.skillLevel === skillLevelFilter)
    }
    
    // Filter by availability
    if (availabilityFilters.length > 0) {
      result = result.filter(player => 
        availabilityFilters.some(filter => player.availability.includes(filter))
      )
    }
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      result = result.filter(player => 
        player.name.toLowerCase().includes(term) || 
        player.email.toLowerCase().includes(term)
      )
    }
    
    setFilteredPlayers(result)
  }

  const resetFilters = () => {
    setSkillLevelFilter("all")
    setAvailabilityFilters([])
    setSearchTerm("")
    setShowOnlyActive(true)
  }

  const handleChallengePlayer = (playerId: string) => {
    router.push(`/challenge?player=${playerId}`)
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
          <h1 className="text-2xl font-bold">Player Directory</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Players</CardTitle>
            <CardDescription>Filter players by skill level and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search by name or email</Label>
                <Input
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skill-level">Skill Level</Label>
                <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
                  <SelectTrigger id="skill-level">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value={SkillLevel.BEGINNER}>Beginner</SelectItem>
                    <SelectItem value={SkillLevel.INTERMEDIATE}>Intermediate</SelectItem>
                    <SelectItem value={SkillLevel.ADVANCED}>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <Label>Availability</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-weekdays" 
                    checked={availabilityFilters.includes(Availability.WEEKDAYS)}
                    onCheckedChange={() => handleAvailabilityFilterChange(Availability.WEEKDAYS)}
                  />
                  <Label htmlFor="filter-weekdays">Weekdays</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-weekends" 
                    checked={availabilityFilters.includes(Availability.WEEKENDS)}
                    onCheckedChange={() => handleAvailabilityFilterChange(Availability.WEEKENDS)}
                  />
                  <Label htmlFor="filter-weekends">Weekends</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-evenings" 
                    checked={availabilityFilters.includes(Availability.EVENINGS)}
                    onCheckedChange={() => handleAvailabilityFilterChange(Availability.EVENINGS)}
                  />
                  <Label htmlFor="filter-evenings">Evenings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-active" 
                    checked={showOnlyActive}
                    onCheckedChange={(checked) => setShowOnlyActive(checked === true)}
                  />
                  <Label htmlFor="filter-active">Show only active players</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Players ({filteredPlayers.length})</h2>
          
          {error && <p className="text-red-500">{error}</p>}
          
          {filteredPlayers.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">No players found matching your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredPlayers.map((player) => (
              <Card key={player.userId} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-grow">
                    <h3 className="text-lg font-semibold">{player.name}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="font-medium">Email:</span> {player.email}</p>
                      <p><span className="font-medium">Skill Level:</span> {player.skillLevel.charAt(0).toUpperCase() + player.skillLevel.slice(1)}</p>
                      <p><span className="font-medium">Availability:</span> {player.availability.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(", ")}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 flex items-center justify-center">
                    <Button onClick={() => handleChallengePlayer(player.userId)}>
                      Challenge Player
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
