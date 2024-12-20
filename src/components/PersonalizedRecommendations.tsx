import { useMemo } from 'react';
import { Brain, Utensils, Moon, Activity } from 'lucide-react';
import { HealthMetrics, UserProfile, HealthGoal } from '../types';

interface PersonalizedRecommendationsProps {
  metrics: HealthMetrics[];
  profile?: UserProfile | null;
  goals: HealthGoal[];
}

const PersonalizedRecommendations = ({ metrics, profile, goals }: PersonalizedRecommendationsProps) => {
  const recommendations = useMemo(() => {
    const today = metrics[0];
    const recommendations = [];

    // Exercise Recommendations
    if (today) {
      if (today.steps < 8000) {
        recommendations.push({
          type: 'exercise',
          icon: <Activity className="w-5 h-5 text-indigo-600" />,
          title: 'Movement Suggestion',
          description: `You're at ${today.steps.toLocaleString()} steps. Try a ${profile?.activityLevel === 'sedentary' ? '15' : '30'}-minute walk to boost your daily activity.`
        });
      }

      if (today.exercise < 30) {
        const exercises = profile?.activityLevel === 'sedentary'
          ? 'gentle stretching or yoga'
          : 'bodyweight exercises like push-ups and squats';
        recommendations.push({
          type: 'exercise',
          icon: <Activity className="w-5 h-5 text-indigo-600" />,
          title: 'Exercise Recommendation',
          description: `Consider ${exercises} to reach your daily exercise goal.`
        });
      }
    }

    // Nutrition Recommendations
    const waterGoal = goals.find(g => g.type === 'water');
    if (today && waterGoal && today.water < waterGoal.target) {
      recommendations.push({
        type: 'nutrition',
        icon: <Utensils className="w-5 h-5 text-green-600" />,
        title: 'Hydration Reminder',
        description: `Try to drink ${waterGoal.target - today.water} more glasses of water today. Set reminders every 2 hours.`
      });
    }

    const calorieGoal = goals.find(g => g.type === 'calories');
    if (today && calorieGoal) {
      const diff = calorieGoal.target - today.calories;
      if (Math.abs(diff) > 300) {
        recommendations.push({
          type: 'nutrition',
          icon: <Utensils className="w-5 h-5 text-green-600" />,
          title: 'Calorie Adjustment',
          description: diff > 0 
            ? `You're under your calorie goal. Consider a healthy snack like nuts or fruit.`
            : `You're over your calorie goal. Try focusing on protein-rich foods and vegetables for your next meal.`
        });
      }
    }

    // Sleep Recommendations
    const avgSleep = metrics.reduce((sum, m) => sum + m.sleep, 0) / metrics.length;
    if (avgSleep < 7) {
      recommendations.push({
        type: 'sleep',
        icon: <Moon className="w-5 h-5 text-purple-600" />,
        title: 'Sleep Improvement',
        description: 'Your average sleep is below 7 hours. Try going to bed 30 minutes earlier and avoiding screens before bedtime.'
      });
    }

    // Mental Wellness
    const recentMoods = metrics.slice(0, 3).map(m => m.mood);
    const avgMood = recentMoods.reduce((sum, m) => sum + m, 0) / recentMoods.length;
    if (avgMood < 3) {
      recommendations.push({
        type: 'wellness',
        icon: <Brain className="w-5 h-5 text-blue-600" />,
        title: 'Mood Boost',
        description: 'Your mood has been lower recently. Consider meditation, nature walks, or connecting with friends.'
      });
    }

    return recommendations;
  }, [metrics, profile, goals]);

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
        <p className="text-gray-600">
          Great job! You're meeting your health goals. Keep up the good work! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="mt-1">{rec.icon}</div>
            <div>
              <h3 className="font-medium mb-1">{rec.title}</h3>
              <p className="text-gray-600">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;