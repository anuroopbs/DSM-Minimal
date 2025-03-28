"use client"

// Player skill level enum
export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

// Player availability enum
export enum Availability {
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
  EVENINGS = "evenings",
}

// Player profile interface
export interface PlayerProfile {
  userId: string;
  name: string;
  email: string;
  skillLevel: SkillLevel;
  availability: Availability[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Match request interface
export interface MatchRequest {
  id: string;
  requesterId: string;
  requesteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  proposedDate?: string;
  createdAt: string;
}

// Match interface
export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  date: string;
  result?: {
    winner: string;
    score: string;
  };
  createdAt: string;
}
