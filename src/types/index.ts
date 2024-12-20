export interface HealthMetrics {
  date: string;
  sleep: number;
  steps: number;
  calories: number;
  water: number;
  mood: 1 | 2 | 3 | 4 | 5;
  exercise: number; // minutes
  weight?: number; // in kg
  restingHeartRate?: number; // bpm
  stressLevel?: 1 | 2 | 3 | 4 | 5; // 1: Very Low, 5: Very High
  mindfulMinutes?: number; // minutes spent on mindfulness activities
  journalEntry?: string; // daily reflection
}

export interface HealthGoal {
  id: string;
  type: 'sleep' | 'steps' | 'calories' | 'water' | 'exercise' | 'weight' | 'mindful';
  target: number;
  current: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface ProgressMetric {
  metric: keyof HealthMetrics;
  change: number; // percentage change
  trend: 'improving' | 'declining' | 'stable';
  message: string;
  timeframe: 'week' | 'month';
}

export interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'breathing' | 'meditation' | 'gratitude' | 'body-scan' | 'visualization';
  completed?: boolean;
}

// Re-export types from the main types file
export * from '../types';