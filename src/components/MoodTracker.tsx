import { memo } from 'react';
import { Frown, Meh, Smile, SmilePlus, Heart } from 'lucide-react';

interface MoodTrackerProps {
  value: number;
  onChange: (value: number) => void;
}

const MoodTracker = memo(({ value, onChange }: MoodTrackerProps) => {
  const moods = [
    { value: 1, icon: Frown, label: 'Bad' },
    { value: 2, icon: Meh, label: 'Poor' },
    { value: 3, icon: Smile, label: 'Okay' },
    { value: 4, icon: SmilePlus, label: 'Good' },
    { value: 5, icon: Heart, label: 'Great' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Today's Mood</h3>
      <div className="flex justify-between items-center">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.value}
              onClick={() => onChange(mood.value)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                value === mood.value
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-8 h-8 mb-1" />
              <span className="text-sm">{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

MoodTracker.displayName = 'MoodTracker';

export default MoodTracker;