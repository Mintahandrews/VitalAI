import { useState, useEffect, useCallback } from "react";
import { Zap, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "../../types/gamification";
import { HealthMetrics } from "../../types";
import BadgeDisplay from "./BadgeDisplay";
import LeaderboardSystem from "./LeaderboardSystem";
import { notify } from "../../utils/notifications";
import ProgressBar from "./ProgressBar";
import DailyQuests from "./DailyQuests";

interface GamificationSystemProps {
  metrics: HealthMetrics[];
}

export interface UserProgress {
  points: number;
  level: number;
  streaks: {
    workout: number;
    healthyEating: number;
    meditation: number;
  };
  achievements: Achievement[];
  xp: number;
  nextLevelXp: number;
}

// Add type safety for achievement categories and types
type AchievementCategory =
  | "fitness"
  | "wellness"
  | "nutrition"
  | "mindfulness"
  | "social";
type AchievementType =
  | "workout"
  | "meditation"
  | "water"
  | "steps"
  | "sleep"
  | "streak"
  | "challenge"
  | "social"
  | "nutrition";

interface AchievementDefinition extends Achievement {
  requirement: number;
  type: AchievementType;
  category: AchievementCategory;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "workout_warrior",
    title: "Workout Warrior",
    description: "Complete 10 workouts",
    icon: "💪",
    requirement: 10,
    type: "workout",
    points: 500,
    tier: "bronze",
    category: "fitness",
  },
  {
    id: "meditation_master",
    title: "Meditation Master",
    description: "Meditate for 5 days in a row",
    icon: "🧘",
    requirement: 5,
    type: "meditation",
    points: 300,
    tier: "bronze",
    category: "wellness",
  },
  {
    id: "hydration_hero",
    title: "Hydration Hero",
    description: "Meet your water goal for 7 days",
    icon: "💧",
    requirement: 7,
    type: "water",
    points: 400,
    tier: "bronze",
    category: "nutrition",
  },
  {
    id: "step_champion",
    title: "Step Champion",
    description: "Reach 10,000 steps in a day",
    icon: "👣",
    requirement: 10000,
    type: "steps",
    points: 200,
    tier: "bronze",
    category: "fitness",
  },
  {
    id: "sleep_master",
    title: "Sleep Master",
    description: "Get 8 hours of sleep for 5 days",
    icon: "😴",
    requirement: 5,
    type: "sleep",
    points: 300,
    tier: "bronze",
    category: "wellness",
  },
  // Add more achievements as needed
];

const GamificationSystem = ({ metrics }: GamificationSystemProps) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    streaks: {
      workout: 0,
      healthyEating: 0,
      meditation: 0,
    },
    achievements: [],
    xp: 0,
    nextLevelXp: 1000,
  });

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const checkAchievements = useCallback(() => {
    ACHIEVEMENTS.forEach((achievement) => {
      if (userProgress.achievements.find((a) => a.id === achievement.id)) {
        return; // Already unlocked
      }

      let progress = 0;
      switch (achievement.type) {
        case "workout":
          progress = metrics.reduce(
            (acc, m) => acc + (m.exercise > 0 ? 1 : 0),
            0
          );
          break;
        case "sleep":
          progress = metrics.reduce(
            (acc, m) => acc + (m.sleep >= 8 ? 1 : 0),
            0
          );
          break;
        // ... other cases
      }

      const achieved = progress >= achievement.requirement;
      if (achieved) {
        unlockAchievement(achievement);
      }
    });
  }, [metrics, userProgress.achievements]);

  const unlockAchievement = (achievement: AchievementDefinition) => {
    setUserProgress((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { ...achievement, unlockedAt: Date.now() },
      ],
      points: prev.points + achievement.points,
      xp: prev.xp + achievement.points,
    }));

    setSelectedAchievement(achievement);
    setShowAnimation(true);
    notify.success(`Achievement Unlocked: ${achievement.title}!`);
  };

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  return (
    <div className="space-y-8 p-6">
      {/* User Level and XP */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              Level {userProgress.level}
            </h2>
            <p className="text-gray-600">{userProgress.points} Total Points</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Next Level</p>
            <p className="font-medium">
              {Math.floor((userProgress.xp / userProgress.nextLevelXp) * 100)}%
            </p>
          </div>
        </div>
        <ProgressBar
          current={userProgress.xp}
          max={userProgress.nextLevelXp}
          className="h-2 bg-indigo-600"
        />
      </div>

      {/* Daily Quests */}
      <DailyQuests />

      {/* Streaks */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Active Streaks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(userProgress.streaks).map(([type, count]) => (
            <div
              key={type}
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <span className="capitalize">{type}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{count}</span>
                <span className="text-orange-500">🔥</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BadgeDisplay
          achievements={userProgress.achievements}
          onSelect={setSelectedAchievement}
        />
        <LeaderboardSystem userPoints={userProgress.points} />
      </div>

      {/* Achievement Animation */}
      <AnimatePresence>
        {showAnimation && selectedAchievement && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setShowAnimation(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 text-center max-w-md mx-4"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
            >
              <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
              <h3 className="text-2xl font-bold mb-2">
                {selectedAchievement.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedAchievement.description}
              </p>
              <p className="text-lg font-semibold text-indigo-600">
                +{selectedAchievement.points} Points!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamificationSystem;
