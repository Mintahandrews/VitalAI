export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type:
    | "workout"
    | "meditation"
    | "water"
    | "steps"
    | "sleep"
    | "streak"
    | "challenge"
    | "social"
    | "nutrition";
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  progress?: number;
  unlockedAt?: number;
  category: "fitness" | "wellness" | "nutrition" | "mindfulness" | "social";
  bonusReward?: {
    amount: number;
    type: "xp" | "points";
  };
  rarity?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  goal: number;
  type: string;
  reward: number;
  participants: string[];
  leaderboard: Array<{ userId: string; progress: number }>;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  threshold: number;
  reward: number;
  achieved: boolean;
}

export { type HealthMetrics } from "../types";
