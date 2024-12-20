import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save } from 'lucide-react';
import { HealthGoal } from '../types';
import UserProfile from './UserProfile';
import HealthProviders from './HealthProviders';

const defaultGoals: HealthGoal[] = [
  { id: uuidv4(), type: 'sleep', target: 8, current: 0 },
  { id: uuidv4(), type: 'steps', target: 10000, current: 0 },
  { id: uuidv4(), type: 'water', target: 8, current: 0 },
  { id: uuidv4(), type: 'exercise', target: 30, current: 0 },
  { id: uuidv4(), type: 'calories', target: 2000, current: 0 },
];

const Settings = () => {
  const [goals, setGoals] = useState<HealthGoal[]>(defaultGoals);

  useEffect(() => {
    const savedGoals = localStorage.getItem('healthGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleGoalChange = (id: string, target: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, target } : goal
    );
    setGoals(updatedGoals);
  };

  const saveGoals = () => {
    localStorage.setItem('healthGoals', JSON.stringify(goals));
    alert('Goals saved successfully!');
  };

  const getUnitLabel = (type: string) => {
    switch (type) {
      case 'sleep':
        return 'hours';
      case 'steps':
        return 'steps';
      case 'water':
        return 'glasses';
      case 'exercise':
        return 'minutes';
      case 'calories':
        return 'kcal';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <UserProfile />
      
      <HealthProviders />

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Health Goals</h2>
          <button
            onClick={saveGoals}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Goals
          </button>
        </div>

        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="border-b pb-4">
              <label className="block mb-2">
                <span className="text-gray-700 font-medium capitalize">
                  Daily {goal.type} Goal ({getUnitLabel(goal.type)})
                </span>
                <input
                  type="number"
                  value={goal.target}
                  onChange={(e) =>
                    handleGoalChange(goal.id, parseInt(e.target.value) || 0)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  min="0"
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;