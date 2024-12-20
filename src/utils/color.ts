export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getMoodColor = (mood: number): string => {
  switch (mood) {
    case 1: return 'text-red-500';
    case 2: return 'text-orange-500';
    case 3: return 'text-yellow-500';
    case 4: return 'text-blue-500';
    case 5: return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const getStressColor = (level: number): string => {
  switch (level) {
    case 1: return 'text-green-500';
    case 2: return 'text-blue-500';
    case 3: return 'text-yellow-500';
    case 4: return 'text-orange-500';
    case 5: return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export const getActivityColor = (intensity: 'low' | 'medium' | 'high'): string => {
  switch (intensity) {
    case 'low': return 'bg-blue-100 text-blue-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};