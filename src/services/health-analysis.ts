import { genAI } from "./gemini";
import { HealthMetrics, UserProfile } from "../types";

export interface AIHealthInsight {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  recommendation?: string;
  priority: number;
}

export async function analyzeHealthData(
  metrics: HealthMetrics[],
  profile?: UserProfile
): Promise<AIHealthInsight[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      As a health and wellness AI assistant, analyze this health data and provide insights:
      
      Recent Health Metrics:
      ${JSON.stringify(metrics[metrics.length - 1], null, 2)}
      
      User Profile:
      ${JSON.stringify(profile, null, 2)}
      
      Previous Day's Metrics:
      ${JSON.stringify(metrics[metrics.length - 2], null, 2)}
      
      Provide a detailed analysis focusing on:
      1. Sleep patterns and quality
      2. Physical activity and exercise
      3. Hydration levels
      4. Mood and stress levels
      5. Overall health trends
      
      Format your response as a JSON array of insights, where each insight has:
      - id: unique string
      - type: "success", "warning", or "info"
      - title: short descriptive title
      - description: detailed explanation
      - recommendation: actionable advice (optional)
      - priority: number 1-5 (1 being highest priority)
      
      Focus on actionable insights and personalized recommendations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const insights = JSON.parse(text);

    // Validate and format insights
    return insights.map((insight: any) => ({
      id: insight.id || `insight-${Date.now()}-${Math.random()}`,
      type: insight.type || "info",
      title: insight.title,
      description: insight.description,
      recommendation: insight.recommendation,
      priority: insight.priority || 3,
    }));
  } catch (error) {
    console.error("Error analyzing health data:", error);
    return [];
  }
}
