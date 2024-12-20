import { useEffect, useState } from "react";
import { Shield, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { PROVIDER_CONFIGS } from "../config/health-providers";
import type { HealthConnection } from "../types/health-providers";
import { notify } from "../utils/notifications";
import { initiateFitbitAuth } from "../services/fitbit-auth";
import { initiateGoogleFitAuth } from "../services/google-fit-auth";

// Use the type from health-providers.ts instead of redefining it
type Provider = "fitbit" | "googlefit" | "apple-health";

export default function HealthProviders() {
  const [connections, setConnections] = useState<HealthConnection[]>([]);
  const [syncing, setSyncing] = useState<Provider | null>(null);

  useEffect(() => {
    // Load saved connections
    const savedConnections = localStorage.getItem("healthConnections");
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  const handleConnect = async (provider: Provider) => {
    try {
      switch (provider) {
        case "googlefit":
          initiateGoogleFitAuth();
          break;

        case "fitbit":
          initiateFitbitAuth();
          break;
      }
    } catch (error) {
      console.error(`Failed to connect to ${provider}:`, error);
      notify.error(`Failed to connect to ${provider}`);
    }
  };

  const handleDisconnect = async (provider: Provider) => {
    try {
      // Implementation
      updateConnectionStatus(provider, false);
      notify.success(`Disconnected from ${provider}`);
    } catch (error) {
      console.error(`Failed to disconnect from ${provider}:`, error);
      notify.error(`Failed to disconnect from ${provider}`);
    }
  };

  const handleSync = async (provider: Provider) => {
    try {
      setSyncing(provider);
      // Implementation
      notify.success(`Synced data from ${provider}`);
    } catch (error) {
      console.error(`Failed to sync data from ${provider}:`, error);
      notify.error(`Failed to sync data from ${provider}`);
    } finally {
      setSyncing(null);
    }
  };

  const updateConnectionStatus = (provider: Provider, isConnected: boolean) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.provider === provider ? { ...conn, isConnected } : conn
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Health Data Providers</h2>
      </div>

      <div className="space-y-4">
        {PROVIDER_CONFIGS.map((config) => {
          const connection = connections.find(
            (c) => c.provider === config.name
          );

          return (
            <div
              key={config.name}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h3 className="font-medium">{config.displayName}</h3>
                  {connection?.lastSync && (
                    <p className="text-sm text-gray-500">
                      Last synced:{" "}
                      {new Date(connection.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {connection?.connected ? (
                  <>
                    <button
                      onClick={() => handleSync(config.name)}
                      disabled={syncing === config.name}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      title="Sync data"
                    >
                      <RefreshCw
                        className={`w-5 h-5 ${
                          syncing === config.name ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDisconnect(config.name)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(config.name)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
