import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { notify } from "../../utils/notifications";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during auth callback:", error.message);
        notify.error("Authentication failed");
        navigate("/signin");
        return;
      }

      if (data.session) {
        notify.success("Email verified successfully");
        navigate("/");
      } else {
        navigate("/signin");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default AuthCallback;
