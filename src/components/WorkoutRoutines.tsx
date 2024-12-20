import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  completed: boolean;
}

interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: '1',
    name: 'Morning Cardio',
    exercises: [
      { id: '1-1', name: 'Jumping Jacks', duration: 60, completed: false },
      { id: '1-2', name: 'High Knees', duration: 45, completed: false },
      { id: '1-3', name: 'Mountain Climbers', duration: 45, completed: false },
      { id: '1-4', name: 'Burpees', duration: 30, completed: false },
    ],
  },
  {
    id: '2',
    name: 'Quick Core',
    exercises: [
      { id: '2-1', name: 'Plank', duration: 60, completed: false },
      { id: '2-2', name: 'Crunches', duration: 45, completed: false },
      { id: '2-3', name: 'Russian Twists', duration: 45, completed: false },
      { id: '2-4', name: 'Leg Raises', duration: 30, completed: false },
    ],
  },
];

const WorkoutRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>(DEFAULT_ROUTINES);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const savedRoutines = localStorage.getItem('workoutRoutines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentExercise) {
      handleExerciseComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startRoutine = (routine: Routine) => {
    const resetRoutine = {
      ...routine,
      exercises: routine.exercises.map(ex => ({ ...ex, completed: false })),
    };
    setActiveRoutine(resetRoutine);
    setCurrentExercise(resetRoutine.exercises[0]);
    setTimeLeft(resetRoutine.exercises[0].duration);
    setIsRunning(true);
  };

  const handleExerciseComplete = () => {
    if (!activeRoutine || !currentExercise) return;

    const updatedRoutine = {
      ...activeRoutine,
      exercises: activeRoutine.exercises.map(ex =>
        ex.id === currentExercise.id ? { ...ex, completed: true } : ex
      ),
    };
    setActiveRoutine(updatedRoutine);

    const nextExerciseIndex = activeRoutine.exercises.findIndex(ex => ex.id === currentExercise.id) + 1;
    if (nextExerciseIndex < activeRoutine.exercises.length) {
      const nextExercise = activeRoutine.exercises[nextExerciseIndex];
      setCurrentExercise(nextExercise);
      setTimeLeft(nextExercise.duration);
      setIsRunning(true);
    } else {
      setActiveRoutine(null);
      setCurrentExercise(null);
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Workout Routines</h2>

      {!activeRoutine ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <div key={routine.id} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{routine.name}</h3>
              <ul className="space-y-2 mb-4">
                {routine.exercises.map((exercise) => (
                  <li key={exercise.id} className="text-sm text-gray-600">
                    {exercise.name} - {exercise.duration}s
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startRoutine(routine)}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Workout
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">{currentExercise?.name}</h3>
          <div className="text-4xl font-mono mb-6">{timeLeft}s</div>
          
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => {
                setTimeLeft(currentExercise?.duration || 0);
                setIsRunning(false);
              }}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleExerciseComplete}
              className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            {activeRoutine.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-2 rounded ${
                  exercise.completed
                    ? 'bg-green-100 text-green-800'
                    : exercise.id === currentExercise?.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100'
                }`}
              >
                {exercise.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutRoutines;