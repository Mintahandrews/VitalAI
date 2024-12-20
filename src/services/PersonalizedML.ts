import { HealthMetrics, UserProfile } from "../types";

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
}

export const personalizedML = (
  metrics: HealthMetrics[],
  profile?: UserProfile
): MLPrediction[] => {
  const insights: MLPrediction[] = [];

  if (metrics.length < 2) return insights;

  // Get the most recent metrics
  const recent = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];

  // Use profile data for personalized targets
  const sleepTarget = profile?.age && profile.age > 65 ? 7 : 8;
  const stepsTarget = profile?.activityLevel && profile.activityLevel === "active" ? 12000 : profile?.activityLevel ? 10000 : 8000;

  // Analyze sleep patterns with personalized target
  if (recent.sleep < sleepTarget) {
    insights.push({
      id: "sleep_warning",
      type: "warning",
      title: "Sleep Duration Below Target",
      description: `You slept ${recent.sleep} hours last night. Aim for ${sleepTarget}-9 hours for optimal health.`,
      metric: "sleep",
      trend: recent.sleep > previous.sleep ? "up" : "down",
      recommendation:
        "Try to maintain a consistent sleep schedule and avoid screens before bedtime.",
      priority: 1,
      timestamp: Date.now(),
    });
  }

  // Analyze step count with personalized target
  const stepTrend = recent.steps > previous.steps ? "up" : "down";
  if (recent.steps < stepsTarget) {
    insights.push({
      id: "steps_warning",
      type: "warning",
      title: "Step Count Below Target",
      description: `You took ${recent.steps.toLocaleString()} steps. Aim for ${stepsTarget.toLocaleString()} steps daily.`,
      metric: "steps",
      trend: stepTrend,
      recommendation:
        "Try taking short walks during breaks or using stairs instead of elevator.",
      priority: 2,
      timestamp: Date.now(),
    });
  }

  // Analyze water intake
  if (recent.water < 8) {
    insights.push({
      id: "hydration_warning",
      type: "warning",
      title: "Hydration Below Target",
      description: `You drank ${recent.water} glasses of water. Aim for 8 glasses daily.`,
      metric: "water",
      trend: recent.water > previous.water ? "up" : "down",
      recommendation: "Set reminders to drink water throughout the day.",
      priority: 3,
      timestamp: Date.now(),
    });
  }

  // Analyze exercise duration
  if (recent.exercise > 30) {
    insights.push({
      id: "exercise_success",
      type: "success",
      title: "Exercise Goal Achieved",
      description: `Great job! You exercised for ${recent.exercise} minutes.`,
      metric: "exercise",
      trend: "up",
      priority: 4,
      timestamp: Date.now(),
    });
  }

  // Add mood-based insights
  if (recent.mood && recent.mood < 3) {
    insights.push({
      id: "mood_support",
      type: "info",
      title: "Mood Support",
      description: "Your mood seems lower than usual.",
      metric: "mood",
      recommendation:
        "Consider trying some mindfulness exercises or reaching out to talk to someone.",
      priority: 1,
      timestamp: Date.now(),
    });
  }

  // Sort insights by priority
  return insights.sort((a, b) => a.priority - b.priority);
};
