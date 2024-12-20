const GOOGLE_FIT_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export interface GoogleFitAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

export const initiateGoogleFitAuth = () => {
  const config: GoogleFitAuthConfig = {
    clientId: import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/google-fit/callback`,
    scope: [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.heart_rate.read",
      "https://www.googleapis.com/auth/fitness.sleep.read",
      "profile",
      "email",
    ],
  };

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "token",
    scope: config.scope.join(" "),
    include_granted_scopes: "true",
    access_type: "offline",
  });

  window.location.href = `${GOOGLE_FIT_AUTH_URL}?${params.toString()}`;
};

export const handleGoogleFitCallback = () => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get("access_token");
  const expiresIn = params.get("expires_in");

  if (!accessToken) {
    throw new Error("No access token received");
  }

  // Store tokens securely
  localStorage.setItem("google_fit_access_token", accessToken);
  if (expiresIn) {
    localStorage.setItem(
      "google_fit_token_expiry",
      String(Date.now() + Number(expiresIn) * 1000)
    );
  }

  return { accessToken, expiresIn };
};
