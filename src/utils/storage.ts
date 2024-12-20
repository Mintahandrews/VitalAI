import { format, subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { HealthMetrics, Achievement } from '../types';

export const generateInitialMetrics = (): HealthMetrics[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    sleep: 7 + Math.random() * 2,
    steps: Math.floor(6000 + Math.random() * 6000),
    calories: Math.floor(1800 + Math.random() * 800),
    water: Math.floor(4 + Math.random() * 5),
    mood: Math.floor(1 + Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
    exercise: Math.floor(15 + Math.random() * 45),
    stressLevel: Math.floor(1 + Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
    mindfulMinutes: Math.floor(Math.random() * 20),
    journalEntry: ''
  }));
};

export const checkAchievements = (metrics: HealthMetrics[]): Achievement[] => {
  const achievements: Achievement[] = [];
  const today = metrics[0];
  const previous = metrics[1];

  // Step achievements
  if (today.steps >= 10000) {
    achievements.push({
      id: uuidv4(),
      title: 'Step Master',
      description: 'Reached 10,000 steps in a day',
      icon: '👣',
      unlockedAt: Date.now()
    });
  }

  // Exercise achievements
  if (today.exercise >= 30) {
    achievements.push({
      id: uuidv4(),
      title: 'Workout Warrior',
      description: 'Completed a 30-minute workout',
      icon: '💪',
      unlockedAt: Date.now()
    });
  }

  // Sleep achievements
  if (today.sleep >= 8) {
    achievements.push({
      id: uuidv4(),
      title: 'Sleep Champion',
      description: 'Got 8+ hours of quality sleep',
      icon: '😴',
      unlockedAt: Date.now()
    });
  }

  // Water intake achievements
  if (today.water >= 8) {
    achievements.push({
      id: uuidv4(),
      title: 'Hydration Hero',
      description: 'Drank 8 glasses of water',
      icon: '💧',
      unlockedAt: Date.now()
    });
  }

  // Mood improvements
  if (previous && today.mood > previous.mood) {
    achievements.push({
      id: uuidv4(),
      title: 'Mood Booster',
      description: 'Improved your mood from yesterday',
      icon: '😊',
      unlockedAt: Date.now()
    });
  }

  // Mindfulness achievements
  if (today.mindfulMinutes && today.mindfulMinutes >= 10) {
    achievements.push({
      id: uuidv4(),
      title: 'Zen Master',
      description: 'Completed 10+ minutes of mindfulness',
      icon: '🧘',
      unlockedAt: Date.now()
    });
  }

  // Stress management
  if (today.stressLevel && today.stressLevel <= 2) {
    achievements.push({
      id: uuidv4(),
      title: 'Stress Manager',
      description: 'Maintained low stress levels',
      icon: '🌟',
      unlockedAt: Date.now()
    });
  }

  // Journal achievements
  if (today.journalEntry && today.journalEntry.length >= 100) {
    achievements.push({
      id: uuidv4(),
      title: 'Reflective Writer',
      description: 'Wrote a detailed journal entry',
      icon: '📝',
      unlockedAt: Date.now()
    });
  }

  return achievements;
};

export const saveMetrics = (metrics: HealthMetrics[]) => {
  localStorage.setItem('healthMetrics', JSON.stringify(metrics));
};

export const getMetrics = (): HealthMetrics[] => {
  const saved = localStorage.getItem('healthMetrics');
  return saved ? JSON.parse(saved) : generateInitialMetrics();
};

export const updateTodayMetrics = (updates: Partial<HealthMetrics>) => {
  const metrics = getMetrics();
  metrics[0] = { ...metrics[0], ...updates };
  saveMetrics(metrics);
  return metrics;
};