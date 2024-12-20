import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../config/supabase";
import { notify } from "../utils/notifications";

export function useDataSync<T>(
  tableName: string,
  initialData: T[] = []
): {
  data: T[];
  loading: boolean;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
} {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, session } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user || !session) {
        if (isMounted) {
          setLoading(false);
          setError(new Error("Please sign in to view your profile"));
        }
        return;
      }

      try {
        // First try to get existing profile
        const { data: result, error: fetchError } = await supabase
          .from(tableName)
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "no rows returned"
          throw fetchError;
        }

        // For profiles table, create a profile if it doesn't exist
        if (tableName === "profiles" && !result) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          if (createError) throw createError;

          if (isMounted) {
            setData(newProfile ? [newProfile] : []);
          }
        } else if (isMounted) {
          setData(result ? [result] : []);
        }

        if (isMounted) {
          setError(null);
        }
      } catch (err) {
        console.error(`Error in useDataSync for ${tableName}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to load profile data"));
          notify.error("Failed to load profile data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tableName, user, session]);

  return { data, loading, error, setData };
}
