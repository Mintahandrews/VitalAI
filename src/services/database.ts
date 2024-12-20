import { supabase } from "./supabase";
import { auth } from "./auth";
import { HealthMetrics, UserProfile } from "../types";
import { notify } from "../utils/notifications";

export const db = {
  async saveHealthMetrics(metrics: HealthMetrics) {
    try {
      const user = await auth.getCurrentUser();
      const { data, error } = await supabase
        .from("health_metrics")
        .insert([{ ...metrics, user_id: user?.id }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving health metrics:", error);
      notify.error("Failed to save health data");
      throw error;
    }
  },

  async getHealthMetrics() {
    try {
      const user = await auth.getCurrentUser();
      const { data, error } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      notify.error("Failed to fetch health data");
      throw error;
    }
  },

  async updateUserProfile(profile: UserProfile) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      notify.error("Failed to update profile");
      throw error;
    }
  },
};
