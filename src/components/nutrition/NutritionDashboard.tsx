import { useState, useEffect } from 'react';
import { Plus, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import MealLogger from './MealLogger';
import NutritionStats from './NutritionStats';
import AIRecommendations from './AIRecommendations';
import { Meal, NutritionGoals } from '../../types/nutrition';

const defaultGoals: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 225,
  fat: 55,
  fiber: 30,
  sugar: 25,
};

const NutritionDashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [goals, setGoals] = useState<NutritionGoals>(defaultGoals);

  useEffect(() => {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }

    const savedGoals = localStorage.getItem('nutritionGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleAddMeal = (meal: Meal) => {
    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    localStorage.setItem('meals', JSON.stringify(updatedMeals));
    setShowMealLogger(false);
  };

  const todaysMeals = meals.filter(
    meal => format(new Date(meal.timestamp), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const calculateTotalNutrition = () => {
    return todaysMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
        fiber: acc.fiber + (meal.nutrition.fiber || 0),
        sugar: acc.sugar + (meal.nutrition.sugar || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
    );
  };

  const totals = calculateTotalNutrition();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Nutrition Tracking</h1>
          <p className="text-gray-600">Track your meals and get personalized recommendations</p>
        </div>
        <button
          onClick={() => setShowMealLogger(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          Log Meal
        </button>
      </div>

      {/* Nutrition Stats */}
      <NutritionStats totals={totals} goals={goals} />

      {/* Today's Meals */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
        {todaysMeals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No meals logged yet today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysMeals.map(meal => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{meal.emoji}</span>
                  <div>
                    <h3 className="font-medium">{meal.name}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(meal.timestamp), 'h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{meal.nutrition.calories} kcal</div>
                  <div className="text-sm text-gray-600">
                    P: {meal.nutrition.protein}g • C: {meal.nutrition.carbs}g • F: {meal.nutrition.fat}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <AIRecommendations meals={meals} goals={goals} />

      {/* Meal Logger Modal */}
      {showMealLogger && (
        <MealLogger onSave={handleAddMeal} onClose={() => setShowMealLogger(false)} />
      )}
    </div>
  );
};

export default NutritionDashboard;