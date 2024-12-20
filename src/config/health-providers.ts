import { ProviderConfig } from "../types/health-providers";

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    name: "fitbit",
    displayName: "Fitbit",
    icon: "🏃",
    clientId: import.meta.env.VITE_FITBIT_CLIENT_ID || "",
    scopes: [
      "activity",
      "heartrate",
      "location",
      "nutrition",
      "profile",
      "settings",
      "sleep",
      "weight",
    ],
  },
  {
    name: "googlefit",
    displayName: "Google Fit",
    icon: "❤️",
    clientId: import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID || "",
    scopes: [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.heart_rate.read",
      "https://www.googleapis.com/auth/fitness.sleep.read",
      "profile",
      "email",
    ],
  },
];
