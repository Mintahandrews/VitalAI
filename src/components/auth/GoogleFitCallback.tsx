import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleFitCallback } from "../../services/google-fit-auth";
import { notify } from "../../utils/notifications";

const GoogleFitCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = () => {
      try {
        handleGoogleFitCallback();
        notify.success("Successfully connected to Google Fit!");
        navigate("/settings");
      } catch (error) {
        console.error("Google Fit auth error:", error);
        notify.error("Failed to connect to Google Fit");
        navigate("/settings");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <div className="text-xl font-semibold mb-4">
          Connecting to Google Fit...
        </div>
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default GoogleFitCallback;
