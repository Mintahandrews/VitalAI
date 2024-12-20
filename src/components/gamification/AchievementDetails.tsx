import { motion } from "framer-motion";
import { Achievement } from "../../types/gamification";
import { formatTimeAgo } from "../../utils/time";
import { Shield, Award, Star, Trophy } from "lucide-react";

interface AchievementDetailsProps {
  achievement: Achievement;
  onClose: () => void;
}

const TierBadge = ({ tier }: { tier: Achievement["tier"] }) => {
  const colors = {
    bronze: "bg-amber-600",
    silver: "bg-gray-400",
    gold: "bg-yellow-500",
    platinum: "bg-gradient-to-r from-purple-400 to-pink-600",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-white text-sm font-medium ${colors[tier]}`}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};

const AchievementDetails = ({
  achievement,
  onClose,
}: AchievementDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{achievement.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{achievement.title}</h2>
          <TierBadge tier={achievement.tier} />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Description</h3>
            <p className="text-gray-600">{achievement.description}</p>
          </div>

          <div className="flex items-center justify-between py-2 border-t">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600">Points</span>
            </div>
            <span className="font-medium text-indigo-600">
              +{achievement.points}
            </span>
          </div>

          {achievement.bonusReward && (
            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">Bonus Reward</span>
              </div>
              <span className="font-medium text-indigo-600">
                +{achievement.bonusReward.amount}{" "}
                {achievement.bonusReward.type.toUpperCase()}
              </span>
            </div>
          )}

          {achievement.rarity && (
            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600">Rarity</span>
              </div>
              <span className="font-medium">
                Top {achievement.rarity.toFixed(1)}%
              </span>
            </div>
          )}

          {achievement.unlockedAt && (
            <div className="flex items-center justify-between py-2 border-t">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Unlocked</span>
              </div>
              <span className="text-gray-500">
                {formatTimeAgo(achievement.unlockedAt)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AchievementDetails;
