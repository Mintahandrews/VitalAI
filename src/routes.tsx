import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import {
  Dashboard,
  Chat,
  SettingsPage,
  GamificationSystem,
  SignIn,
  SignUp,
  AuthCallback,
  FitbitCallback,
  GoogleFitCallback,
} from "./components/LazyComponents";
import { generateInitialMetrics } from "./utils/storage";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const metrics = generateInitialMetrics();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={user ? <Layout /> : <Navigate to="/signin" />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route
            path="achievements"
            element={<GamificationSystem metrics={metrics} />}
          />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="auth/fitbit/callback" element={<FitbitCallback />} />
          <Route
            path="auth/google-fit/callback"
            element={<GoogleFitCallback />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
