export interface Meal {
  id: string;
  name: string;
  emoji: string;
  timestamp: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface MealPlan {
  id: string;
  name: string;
  meals: Meal[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutritionPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  favorites: string[];
  disliked: string[];
}