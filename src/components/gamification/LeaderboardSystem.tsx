import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar: string;
}

interface LeaderboardSystemProps {
  userPoints: number;
}

const LeaderboardSystem = ({ userPoints }: LeaderboardSystemProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    // In a real app, this would fetch from your backend
    // For demo, we'll generate mock data
    generateMockLeaderboard();
  }, [timeFrame, userPoints]);

  const generateMockLeaderboard = () => {
    const mockUsers: LeaderboardEntry[] = [
      {
        id: 'user-1',
        name: 'You',
        points: userPoints,
        rank: 1,
        avatar: '👤',
      },
      ...Array.from({ length: 9 }, (_, i) => ({
        id: `user-${i + 2}`,
        name: `User ${i + 2}`,
        points: Math.floor(Math.random() * userPoints * 1.5),
        rank: i + 2,
        avatar: ['👨', '👩', '🧑'][Math.floor(Math.random() * 3)],
      })),
    ];

    // Sort by points and assign ranks
    const sorted = mockUsers.sort((a, b) => b.points - a.points);
    sorted.forEach((user, index) => {
      user.rank = index + 1;
    });

    setLeaderboard(sorted);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-gray-500">{rank}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Leaderboard</h2>
        </div>

        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-3 py-1 rounded-lg text-sm ${
                timeFrame === frame
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-3 rounded-lg ${
              entry.name === 'You' ? 'bg-indigo-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-8">{getRankIcon(entry.rank)}</div>
            <div className="flex-1 flex items-center">
              <span className="text-xl mr-2">{entry.avatar}</span>
              <span className={entry.name === 'You' ? 'font-medium' : ''}>
                {entry.name}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{entry.points.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Keep earning points to climb the ranks!
      </div>
    </div>
  );
};

export default LeaderboardSystem;