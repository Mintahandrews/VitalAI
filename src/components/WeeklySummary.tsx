import { useMemo } from "react";
import { HealthMetrics } from "../types";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface WeeklySummaryProps {
  metrics: HealthMetrics[];
}

const WeeklySummary = ({ metrics }: WeeklySummaryProps) => {
  const summary = useMemo(() => {
    const averages = {
      sleep: 0,
      steps: 0,
      calories: 0,
      water: 0,
      exercise: 0,
      mood: 0,
    };

    if (metrics.length > 0) {
      Object.keys(averages).forEach((key) => {
        const sum = metrics.reduce(
          (acc, curr) => acc + Number(curr[key as keyof HealthMetrics] || 0),
          0
        );
        const avg = sum / metrics.length;
        averages[key as keyof typeof averages] =
          key === "sleep" ? Number(avg.toFixed(1)) : Math.round(avg * 10) / 10;
      });
    }

    return averages;
  }, [metrics]);

  const getTrend = (current: number, average: number) => {
    const diff = ((current - average) / average) * 100;
    if (Math.abs(diff) < 5) return "neutral";
    return diff > 0 ? "up" : "down";
  };

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLatestMetric = (key: keyof HealthMetrics): number => {
    const value = metrics[metrics.length - 1]?.[key];
    return key === "sleep"
      ? Number(typeof value === "string" ? parseFloat(value) : value || 0)
      : Number(value || 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(summary).map(([key, average]) => {
          const current = getLatestMetric(key as keyof HealthMetrics);
          const trend = getTrend(current, average);

          return (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium capitalize">{key}</span>
                {renderTrendIcon(trend)}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {key === "sleep" ? current.toFixed(1) : current}
                </span>
                <span className="text-sm text-gray-500">
                  avg: {key === "sleep" ? average.toFixed(1) : average}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySummary;
