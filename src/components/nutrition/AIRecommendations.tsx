import { Brain, Carrot, Flame, Check } from 'lucide-react';
import { Meal, NutritionGoals } from '../../types/nutrition';

interface AIRecommendationsProps {
  meals: Meal[];
  goals: NutritionGoals;
}

const AIRecommendations = ({ meals, goals }: AIRecommendationsProps) => {
  // Calculate daily totals
  const todaysTotals = meals
    .filter(meal => {
      const mealDate = new Date(meal.timestamp);
      const today = new Date();
      return (
        mealDate.getDate() === today.getDate() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  // Generate recommendations based on current progress
  const recommendations = [];

  // Calorie recommendations
  const remainingCalories = goals.calories - todaysTotals.calories;
  if (remainingCalories > 500) {
    recommendations.push({
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      title: 'Calorie Intake',
      message: `You still need ${remainingCalories.toFixed(0)} calories to reach your daily goal. Consider having a balanced meal or healthy snack.`
    });
  }

  // Protein recommendations
  const remainingProtein = goals.protein - todaysTotals.protein;
  if (remainingProtein > 20) {
    recommendations.push({
      icon: <Carrot className="w-5 h-5 text-green-500" />,
      title: 'Protein Intake',
      message: `You're ${remainingProtein.toFixed(0)}g short on protein. Good sources include lean meats, eggs, or legumes.`
    });
  }

  // Meal timing recommendations
  const lastMealTime = meals.length > 0 ? new Date(meals[meals.length - 1].timestamp) : null;
  if (lastMealTime) {
    const hoursSinceLastMeal = (Date.now() - lastMealTime.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastMeal > 4) {
      recommendations.push({
        icon: <Brain className="w-5 h-5 text-purple-500" />,
        title: 'Meal Timing',
        message: "It's been a while since your last meal. Consider having a small, nutritious snack to maintain energy levels."
      });
    }
  }

  if (recommendations.length === 0) {
    recommendations.push({
      icon: <Check className="w-5 h-5 text-green-500" />,
      title: 'On Track',
      message: "You're doing great! Keep up with your current eating patterns."
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">AI Recommendations</h2>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="mt-1">{rec.icon}</div>
            <div>
              <h3 className="font-medium mb-1">{rec.title}</h3>
              <p className="text-gray-600">{rec.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;