"use client"

// Player skill level enum
export enum SkillLevel {
  DIVISION_6 = "division_6", // Beginner 1
  DIVISION_5 = "division_5", // Beginner 2 
  DIVISION_4 = "division_4", // Intermediate 1
  DIVISION_3 = "division_3", // Intermediate 2
  DIVISION_2 = "division_2", // Advanced 1
  DIVISION_1 = "division_1", // Advanced 2
  PREMIER = "premier" // Professional
}

export const SkillLevelDescriptions = {
  [SkillLevel.DIVISION_6]: "Brand new to squash (0–3 months); learning rules, strokes, and basic movement",
  [SkillLevel.DIVISION_5]: "Newer players (4–12 months) building technique, consistency, and confidence in games",
  [SkillLevel.DIVISION_4]: "Players developing match tactics, movement, and shot variety",
  [SkillLevel.DIVISION_3]: "Competitive intermediates with solid match performance and improving strategy",
  [SkillLevel.DIVISION_2]: "High-level club and top regional players with consistent wins and control",
  [SkillLevel.DIVISION_1]: "Top national players with strong tournament results and advanced gameplay",
  [SkillLevel.PREMIER]: "Professional-level players with elite skill, fitness, and tactical mastery"
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
