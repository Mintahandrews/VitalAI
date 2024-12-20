import { useEffect } from "react";
import { HealthMetrics, UserProfile } from "../types";
import { personalizedML } from "../services/PersonalizedML";
import { notify } from "../utils/notifications";

interface AIHealthAnalysisProps {
  metrics: HealthMetrics[];
  profile?: UserProfile;
}

const AIHealthAnalysis = ({ metrics, profile }: AIHealthAnalysisProps) => {
  useEffect(() => {
    try {
      personalizedML(metrics, profile);
    } catch (error) {
      console.error("Failed to generate health insights:", error);
      notify.error("Failed to analyze health data");
    }
  }, [metrics, profile]);

  return null; // or your JSX
};

export default AIHealthAnalysis;
