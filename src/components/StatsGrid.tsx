import { useMemo } from "react";
import { HealthMetrics } from "../types";
import { Activity, Droplets, Moon, Heart } from "lucide-react";

interface StatsGridProps {
  metrics: HealthMetrics[];
}

const StatsGrid = ({ metrics }: StatsGridProps) => {
  const stats = useMemo(() => {
    if (!metrics.length) return null;

    const totalSteps = metrics.reduce((sum, m) => sum + m.steps, 0);
    const totalWater = metrics.reduce((sum, m) => sum + m.water, 0);
    const avgSleep =
      metrics.reduce((sum, m) => sum + m.sleep, 0) / metrics.length;
    const totalCalories = metrics.reduce((sum, m) => sum + m.calories, 0);

    return {
      totalSteps,
      totalWater,
      avgSleep,
      totalCalories,
    };
  }, [metrics]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-sm sm:text-base">Total Steps</h3>
        </div>
        <p className="text-xl sm:text-2xl font-bold truncate">
          {stats.totalSteps.toLocaleString()}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">This week</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-sm sm:text-base">Water Intake</h3>
        </div>
        <p className="text-xl sm:text-2xl font-bold truncate">
          {stats.totalWater} glasses
        </p>
        <p className="text-xs sm:text-sm text-gray-500">This week</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <Moon className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium text-sm sm:text-base">Avg Sleep</h3>
        </div>
        <p className="text-xl sm:text-2xl font-bold truncate">
          {stats.avgSleep.toFixed(1)}h
        </p>
        <p className="text-xs sm:text-sm text-gray-500">Per night</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-orange-600" />
          <h3 className="font-medium text-sm sm:text-base">Calories</h3>
        </div>
        <p className="text-xl sm:text-2xl font-bold truncate">
          {stats.totalCalories.toLocaleString()}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">This week</p>
      </div>
    </div>
  );
};

export default StatsGrid;
