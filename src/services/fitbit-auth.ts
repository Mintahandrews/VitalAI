const FITBIT_AUTH_URL = "https://www.fitbit.com/oauth2/authorize";
const FITBIT_TOKEN_URL = "https://api.fitbit.com/oauth2/token";

export interface FitbitAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

export const initiateFitbitAuth = () => {
  const config: FitbitAuthConfig = {
    clientId: import.meta.env.VITE_FITBIT_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/fitbit/callback`,
    scope: [
      "activity",
      "heartrate",
      "location",
      "nutrition",
      "profile",
      "settings",
      "sleep",
      "weight",
    ],
  };

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope.join(" "),
    expires_in: "31536000", // 1 year
  });

  window.location.href = `${FITBIT_AUTH_URL}?${params.toString()}`;
};

export const handleFitbitCallback = async (code: string) => {
  try {
    const response = await fetch(FITBIT_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_FITBIT_CLIENT_ID,
        grant_type: "authorization_code",
        redirect_uri: `${window.location.origin}/auth/fitbit/callback`,
        code,
      }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.errors?.[0]?.message || "Failed to get access token"
      );

    // Store tokens securely
    localStorage.setItem("fitbit_access_token", data.access_token);
    localStorage.setItem("fitbit_refresh_token", data.refresh_token);
    localStorage.setItem(
      "fitbit_token_expiry",
      String(Date.now() + data.expires_in * 1000)
    );

    return data;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};
