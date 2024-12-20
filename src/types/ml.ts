export interface MLPrediction {
  id: string;
  type: "success" | "warning" | "info" | "achievement";
  title: string;
  description: string;
  metric?: string;
  trend?: "up" | "down" | "stable";
  recommendation?: string;
  priority: number;
  timestamp: number;
  recommendedActivity?: number;
  similarUsers?: number;
  sleepTarget?: number;
  stressRisk?: number;
  nutritionSuggestions?: string[];
}
