import { memo } from 'react';
import { HealthGoal } from '../types';

interface GoalProgressProps {
  goal: HealthGoal;
}

const GoalProgress = memo(({ goal }: GoalProgressProps) => {
  const progress = (goal.current / goal.target) * 100;
  const progressCapped = Math.min(100, progress);
  
  const getStatusColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium capitalize">{goal.type}</span>
        <span className="text-sm text-gray-500">
          {goal.current} / {goal.target}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getStatusColor()} transition-all duration-500`}
          style={{ width: `${progressCapped}%` }}
        />
      </div>
    </div>
  );
});

GoalProgress.displayName = 'GoalProgress';

export default GoalProgress;