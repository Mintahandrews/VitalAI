import { useState } from "react";
import { Achievement } from "../../types/gamification";
import AchievementDetails from "./AchievementDetails";

interface BadgeDisplayProps {
  achievements: Achievement[];
  onSelect?: (achievement: Achievement | null) => void;
}

const BadgeDisplay = ({ achievements, onSelect }: BadgeDisplayProps) => {
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  // Sort achievements by unlock date and rarity
  const sortedAchievements = [...achievements].sort(
    (a: Achievement, b: Achievement): number => {
      // First sort by unlock status
      if (a.unlockedAt && !b.unlockedAt) return -1;
      if (!a.unlockedAt && b.unlockedAt) return 1;

      // Then by rarity if both are unlocked
      if (a.unlockedAt && b.unlockedAt) {
        return (b.rarity || 0) - (a.rarity || 0);
      }

      return 0;
    }
  );

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    onSelect?.(achievement);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            onClick={() => handleAchievementClick(achievement)}
            className="relative cursor-pointer group"
          >
            {/* Achievement display logic */}
          </div>
        ))}
      </div>

      {selectedAchievement && (
        <AchievementDetails
          achievement={selectedAchievement}
          onClose={() => {
            setSelectedAchievement(null);
            onSelect?.(null);
          }}
        />
      )}
    </div>
  );
};

export default BadgeDisplay;
