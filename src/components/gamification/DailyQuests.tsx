import { useState, useEffect } from "react";
import { CheckCircle2, Circle, RefreshCw } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: string;
  target: number;
  progress: number;
  expiresAt: number;
}

const DailyQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    // Load quests from localStorage or generate new ones
    loadOrGenerateQuests();

    // Update time until reset
    const interval = setInterval(updateTimeUntilReset, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadOrGenerateQuests = () => {
    const saved = localStorage.getItem("dailyQuests");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (new Date(parsed.generatedAt).getDate() === new Date().getDate()) {
        setQuests(parsed.quests);
        return;
      }
    }
    generateNewQuests();
  };

  const generateNewQuests = () => {
    const newQuests: Quest[] = [
      {
        id: "1",
        title: "Take 8,000 Steps",
        description: "Complete 8,000 steps today",
        reward: 100,
        completed: false,
        type: "steps",
        target: 8000,
        progress: 0,
        expiresAt: getTodayEnd(),
      },
      {
        id: "2",
        title: "Drink Water",
        description: "Drink 8 glasses of water",
        reward: 50,
        completed: false,
        type: "water",
        target: 8,
        progress: 0,
        expiresAt: getTodayEnd(),
      },
      {
        id: "3",
        title: "Meditate",
        description: "Complete a 10-minute meditation",
        reward: 75,
        completed: false,
        type: "meditation",
        target: 10,
        progress: 0,
        expiresAt: getTodayEnd(),
      },
    ];

    setQuests(newQuests);
    localStorage.setItem(
      "dailyQuests",
      JSON.stringify({
        quests: newQuests,
        generatedAt: new Date(),
      })
    );
  };

  const updateTimeUntilReset = () => {
    const now = new Date();
    const end = getTodayEnd();
    const diff = end - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeUntilReset(`${hours}h ${minutes}m`);
  };

  const getTodayEnd = () => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date.getTime();
  };

  useEffect(() => {
    const checkExpiredQuests = () => {
      const now = new Date().getTime();
      quests.forEach((quest) => {
        if (now > quest.expiresAt) {
          generateNewQuests();
        }
      });
    };

    const interval = setInterval(checkExpiredQuests, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [quests]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Daily Quests</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw className="w-4 h-4" />
          <span>Resets in {timeUntilReset}</span>
        </div>
      </div>

      <div className="space-y-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-start gap-3">
              {quest.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 mt-1" />
              )}
              <div>
                <h3 className="font-medium">{quest.title}</h3>
                <p className="text-sm text-gray-600">{quest.description}</p>
                <div className="mt-2">
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (quest.progress / quest.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {quest.progress} / {quest.target}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-indigo-600">
                +{quest.reward} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyQuests;
