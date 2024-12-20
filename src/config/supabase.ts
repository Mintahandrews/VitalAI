import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cache utility functions
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<unknown>>();

export const cacheUtils = {
  get: <T>(key: string): T | null => {
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  },

  set: <T>(key: string, data: T): void => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  clear: (key?: string): void => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  },
};
