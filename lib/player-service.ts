"use client"

import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"
import { PlayerProfile, SkillLevel, Availability, MatchRequest } from "./player-types"

// Player Profile Operations
export async function createPlayerProfile(userId: string, name: string, email: string, skillLevel: SkillLevel, availability: Availability[]) {
  try {
    const playerProfile: PlayerProfile = {
      userId,
      name,
      email,
      skillLevel,
      availability,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await setDoc(doc(db, "playerProfiles", userId), playerProfile)
    return { success: true, message: "Player profile created successfully" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getPlayerProfile(userId: string) {
  try {
    const profileDoc = await getDoc(doc(db, "playerProfiles", userId))
    
    if (profileDoc.exists()) {
      return { success: true, profile: profileDoc.data() as PlayerProfile }
    } else {
      return { success: false, message: "Player profile not found" }
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updatePlayerProfile(userId: string, updates: Partial<PlayerProfile>) {
  try {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(doc(db, "playerProfiles", userId), updatedData)
    return { success: true, message: "Player profile updated successfully" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getAllPlayers(excludeUserId?: string) {
  try {
    const playersQuery = query(collection(db, "playerProfiles"))
    const querySnapshot = await getDocs(playersQuery)
    
    const playersList: PlayerProfile[] = []
    querySnapshot.forEach((doc) => {
      const playerData = doc.data() as PlayerProfile
      // Exclude the current user if specified
      if (!excludeUserId || playerData.userId !== excludeUserId) {
        playersList.push(playerData)
      }
    })
    
    return { success: true, players: playersList }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getFilteredPlayers(filters: {
  skillLevel?: SkillLevel,
  availability?: Availability[],
  isActive?: boolean,
  searchTerm?: string,
  excludeUserId?: string
}) {
  try {
    // Start with getting all players
    const result = await getAllPlayers(filters.excludeUserId)
    
    if (!result.success) {
      return result
    }
    
    let filteredPlayers = result.players
    
    // Apply filters
    if (filters.isActive !== undefined) {
      filteredPlayers = filteredPlayers.filter(player => player.isActive === filters.isActive)
    }
    
    if (filters.skillLevel) {
      filteredPlayers = filteredPlayers.filter(player => player.skillLevel === filters.skillLevel)
    }
    
    if (filters.availability && filters.availability.length > 0) {
      filteredPlayers = filteredPlayers.filter(player => 
        filters.availability!.some(filter => player.availability.includes(filter))
      )
    }
    
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      const term = filters.searchTerm.toLowerCase()
      filteredPlayers = filteredPlayers.filter(player => 
        player.name.toLowerCase().includes(term) || 
        player.email.toLowerCase().includes(term)
      )
    }
    
    return { success: true, players: filteredPlayers }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Match Request Operations
export async function createMatchRequest(requesterId: string, requesterName: string, requesterEmail: string, 
                                        requesteeId: string, requesteeName: string, requesteeEmail: string, 
                                        proposedDate: Date) {
  try {
    const matchRequest = {
      requesterId,
      requesterName,
      requesterEmail,
      requesteeId,
      requesteeName,
      requesteeEmail,
      status: 'pending',
      proposedDate: proposedDate.toISOString(),
      createdAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "matchRequests"), matchRequest)
    return { success: true, message: "Match request created successfully", requestId: docRef.id }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getIncomingMatchRequests(userId: string) {
  try {
    const incomingQuery = query(
      collection(db, "matchRequests"),
      where("requesteeId", "==", userId),
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
    
    return { success: true, requests: incomingData }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getOutgoingMatchRequests(userId: string) {
  try {
    const outgoingQuery = query(
      collection(db, "matchRequests"),
      where("requesterId", "==", userId)
    )
    
    const outgoingSnapshot = await getDocs(outgoingQuery)
    const outgoingData: MatchRequest[] = []
    
    outgoingSnapshot.forEach((doc) => {
      outgoingData.push({
        id: doc.id,
        ...doc.data() as Omit<MatchRequest, 'id'>
      })
    })
    
    return { success: true, requests: outgoingData }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateMatchRequestStatus(requestId: string, status: 'accepted' | 'declined') {
  try {
    await updateDoc(doc(db, "matchRequests", requestId), {
      status
    })
    
    return { success: true, message: `Match request ${status}` }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function cancelMatchRequest(requestId: string) {
  try {
    await deleteDoc(doc(db, "matchRequests", requestId))
    return { success: true, message: "Match request cancelled" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Match Operations
export async function createMatch(player1Id: string, player1Name: string, player2Id: string, player2Name: string, matchDate: Date) {
  try {
    const match = {
      player1Id,
      player1Name,
      player2Id,
      player2Name,
      date: matchDate.toISOString(),
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, "matches"), match)
    return { success: true, message: "Match created successfully", matchId: docRef.id }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getUserMatches(userId: string) {
  try {
    // Fetch matches where user is player1
    const player1Query = query(
      collection(db, "matches"),
      where("player1Id", "==", userId)
    )
    
    const player1Snapshot = await getDocs(player1Query)
    const player1Matches: any[] = []
    
    player1Snapshot.forEach((doc) => {
      player1Matches.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Fetch matches where user is player2
    const player2Query = query(
      collection(db, "matches"),
      where("player2Id", "==", userId)
    )
    
    const player2Snapshot = await getDocs(player2Query)
    const player2Matches: any[] = []
    
    player2Snapshot.forEach((doc) => {
      player2Matches.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    // Combine and sort by date
    const allMatches = [...player1Matches, ...player2Matches]
    allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    return { success: true, matches: allMatches }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateMatchResult(matchId: string, winner: string, score: string) {
  try {
    await updateDoc(doc(db, "matches", matchId), {
      result: {
        winner,
        score
      }
    })
    
    return { success: true, message: "Match result updated" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
