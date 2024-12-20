import { useState, useEffect } from "react";
import { Brain, Wind, BookHeart, Timer } from "lucide-react";
import { HealthMetrics, MindfulnessExercise } from "../types";
import MoodTracker from "./MoodTracker";

const defaultExercises: MindfulnessExercise[] = [
  {
    id: "1",
    title: "Deep Breathing",
    description:
      "Practice deep breathing exercises to reduce stress and anxiety.",
    duration: 5,
    category: "breathing",
  },
  {
    id: "2",
    title: "Body Scan Meditation",
    description:
      "A guided meditation focusing on different parts of your body.",
    duration: 10,
    category: "body-scan",
  },
  {
    id: "3",
    title: "Gratitude Journal",
    description: "Write down three things you're grateful for today.",
    duration: 5,
    category: "gratitude",
  },
  {
    id: "4",
    title: "Visualization Exercise",
    description: "Imagine a peaceful place and focus on the details.",
    duration: 7,
    category: "visualization",
  },
];

interface MentalHealthProps {
  metrics: HealthMetrics;
  onUpdate: (updates: Partial<HealthMetrics>) => void;
}

const MentalHealth = ({ metrics, onUpdate }: MentalHealthProps) => {
  const [journalEntry, setJournalEntry] = useState(metrics.journalEntry || "");
  const [exercises, setExercises] = useState<MindfulnessExercise[]>([]);
  const [activeExercise, setActiveExercise] =
    useState<MindfulnessExercise | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mindfulnessExercises");
    setExercises(saved ? JSON.parse(saved) : defaultExercises);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && activeExercise) {
      handleExerciseComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleStressLevelChange = (level: number) => {
    onUpdate({ stressLevel: level as 1 | 2 | 3 | 4 | 5 });
  };

  const handleJournalChange = (entry: string) => {
    setJournalEntry(entry);
    onUpdate({ journalEntry: entry });
  };

  const startExercise = (exercise: MindfulnessExercise) => {
    setActiveExercise(exercise);
    setTimer(exercise.duration * 60);
    setIsTimerRunning(true);
  };

  const handleExerciseComplete = () => {
    if (activeExercise) {
      const updatedExercises = exercises.map((ex) =>
        ex.id === activeExercise.id ? { ...ex, completed: true } : ex
      );
      setExercises(updatedExercises);
      localStorage.setItem(
        "mindfulnessExercises",
        JSON.stringify(updatedExercises)
      );
      onUpdate({
        mindfulMinutes: (metrics.mindfulMinutes || 0) + activeExercise.duration,
      });
    }
    setActiveExercise(null);
    setIsTimerRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Mental Health Tracker</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Today's Mood</h3>
            <MoodTracker
              value={metrics.mood}
              onChange={(value: number) => {
                onUpdate({ mood: value as 1 | 2 | 3 | 4 | 5 });
              }}
            />
          </div>

          <div>
            <h3 className="font-medium mb-3">Stress Level</h3>
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleStressLevelChange(level)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    metrics.stressLevel === level
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl mb-1">
                    {level === 1
                      ? "😌"
                      : level === 2
                      ? "😊"
                      : level === 3
                      ? "😐"
                      : level === 4
                      ? "😟"
                      : "😰"}
                  </span>
                  <span className="text-sm">
                    {level === 1
                      ? "Very Low"
                      : level === 2
                      ? "Low"
                      : level === 3
                      ? "Moderate"
                      : level === 4
                      ? "High"
                      : "Very High"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookHeart className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Daily Reflection</h2>
        </div>

        <textarea
          value={journalEntry}
          onChange={(e) => handleJournalChange(e.target.value)}
          placeholder="How are you feeling today? What's on your mind?"
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wind className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">Mindfulness Exercises</h2>
        </div>

        {activeExercise ? (
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">{activeExercise.title}</h3>
            <div className="text-4xl font-mono mb-6">
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </div>
            <p className="text-gray-600 mb-6">{activeExercise.description}</p>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isTimerRunning ? "Pause" : "Resume"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-4 border rounded-lg ${
                  exercise.completed ? "bg-gray-50" : "hover:border-purple-500"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{exercise.title}</h3>
                  <span className="flex items-center text-sm text-gray-500">
                    <Timer className="w-4 h-4 mr-1" />
                    {exercise.duration}min
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {exercise.description}
                </p>
                {!exercise.completed && (
                  <button
                    onClick={() => startExercise(exercise)}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Exercise
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalHealth;
