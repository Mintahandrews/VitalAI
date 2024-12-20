import { Achievement } from '../types';
import { X } from 'lucide-react';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementModal = ({ achievement, onClose }: AchievementModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mb-4">
            <span className="text-4xl">{achievement.icon}</span>
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
          <p className="text-gray-600 mb-4">{achievement.description}</p>
          
          <div className="text-sm text-gray-500">
            Unlocked on {new Date(achievement.unlockedAt || Date.now()).toLocaleDateString()}
          </div>

          <button
            onClick={onClose}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;