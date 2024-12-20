import { PieChart, Battery, Leaf } from 'lucide-react';
import { NutritionGoals } from '../../types/nutrition';

interface NutritionStatsProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  goals: NutritionGoals;
}

const NutritionStats = ({ totals, goals }: NutritionStatsProps) => {
  const calculatePercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Calorie Progress */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Battery className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium">Calories</h3>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-3xl font-bold">{totals.calories}</span>
            <span className="text-gray-500">/ {goals.calories}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2 transition-all"
              style={{ width: `${calculatePercentage(totals.calories, goals.calories)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Macronutrients */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium">Macros</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Protein</span>
              <span className={getStatusColor(calculatePercentage(totals.protein, goals.protein))}>
                {totals.protein}g / {goals.protein}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 rounded-full h-1.5 transition-all"
                style={{ width: `${calculatePercentage(totals.protein, goals.protein)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Carbs</span>
              <span className={getStatusColor(calculatePercentage(totals.carbs, goals.carbs))}>
                {totals.carbs}g / {goals.carbs}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 rounded-full h-1.5 transition-all"
                style={{ width: `${calculatePercentage(totals.carbs, goals.carbs)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Fat</span>
              <span className={getStatusColor(calculatePercentage(totals.fat, goals.fat))}>
                {totals.fat}g / {goals.fat}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-yellow-500 rounded-full h-1.5 transition-all"
                style={{ width: `${calculatePercentage(totals.fat, goals.fat)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Other Nutrients */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium">Other Nutrients</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Fiber</span>
              <span className={getStatusColor(calculatePercentage(totals.fiber, goals.fiber))}>
                {totals.fiber}g / {goals.fiber}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-purple-500 rounded-full h-1.5 transition-all"
                style={{ width: `${calculatePercentage(totals.fiber, goals.fiber)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Sugar</span>
              <span className={getStatusColor(100 - calculatePercentage(totals.sugar, goals.sugar))}>
                {totals.sugar}g / {goals.sugar}g
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-red-500 rounded-full h-1.5 transition-all"
                style={{ width: `${calculatePercentage(totals.sugar, goals.sugar)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionStats;