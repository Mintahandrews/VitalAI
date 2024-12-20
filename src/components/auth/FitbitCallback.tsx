import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleFitbitCallback } from "../../services/fitbit-auth";
import { notify } from "../../utils/notifications";

const FitbitCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          throw new Error("No authorization code received");
        }

        await handleFitbitCallback(code);
        notify.success("Successfully connected to Fitbit!");
        navigate("/settings");
      } catch (error) {
        console.error("Fitbit auth error:", error);
        notify.error("Failed to connect to Fitbit");
        navigate("/settings");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <div className="text-xl font-semibold mb-4">
          Connecting to Fitbit...
        </div>
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default FitbitCallback;
