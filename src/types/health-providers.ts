export type HealthProvider = 'fitbit' | 'googlefit' | 'apple-health';

export interface HealthConnection {
  provider: HealthProvider;
  connected: boolean;
  lastSync?: number;
  token?: string;
  refreshToken?: string;
}

export interface HealthDataResponse {
  steps: number;
  heartRate?: {
    current: number;
    min: number;
    max: number;
  };
  sleep?: {
    duration: number;
    quality: 'light' | 'deep' | 'rem';
  };
  activity?: {
    calories: number;
    duration: number;
    type: string;
  };
}

export interface ProviderConfig {
  name: HealthProvider;
  displayName: string;
  icon: string;
  clientId: string;
  scopes: string[];
}