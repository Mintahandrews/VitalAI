export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string;
          age: number;
          weight: number;
          height: number;
          gender: 'male' | 'female' | 'other';
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      health_metrics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          sleep: number;
          steps: number;
          calories: number;
          water: number;
          mood: 1 | 2 | 3 | 4 | 5;
          exercise: number;
          weight?: number;
          resting_heart_rate?: number;
          stress_level?: 1 | 2 | 3 | 4 | 5;
          mindful_minutes?: number;
          journal_entry?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['health_metrics']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['health_metrics']['Insert']>;
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          icon: string;
          unlocked_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}