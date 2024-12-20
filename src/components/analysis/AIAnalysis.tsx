import { useEffect, useState } from "react";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { HealthMetrics, UserProfile } from "../../types";
import {
  AIHealthInsight,
  analyzeHealthData,
} from "../../services/health-analysis";
import { notify } from "../../utils/notifications";

interface AIAnalysisProps {
  metrics: HealthMetrics[];
  profile?: UserProfile;
}

const AIAnalysis = ({ metrics, profile }: AIAnalysisProps) => {
  const [insights, setInsights] = useState<AIHealthInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (metrics.length < 2) return;

      setLoading(true);
      try {
        const aiInsights = await analyzeHealthData(metrics, profile);
        setInsights(aiInsights);
      } catch (error) {
        console.error("Failed to get AI insights:", error);
        notify.error("Failed to analyze health data");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [metrics, profile]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Brain className="w-5 h-5 text-purple-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">AI Health Analysis</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">AI Health Analysis</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <Brain className="w-5 h-5" />
          <p>No insights available yet. Keep tracking your health metrics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">AI Health Analysis</h2>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="mt-1">{getTypeIcon(insight.type)}</div>
            <div className="flex-1">
              <h3 className="font-medium">{insight.title}</h3>
              <p className="text-gray-600 mt-1">{insight.description}</p>
              {insight.recommendation && (
                <p className="text-indigo-600 text-sm mt-2">
                  💡 {insight.recommendation}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIAnalysis;
