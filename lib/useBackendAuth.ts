import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useBackendAuth() {
  const { user, isLoaded } = useUser();
  const [backendToken, setBackendToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (isLoaded && user?.emailAddresses?.[0]?.emailAddress) {
      setLoading(true);
      fetch("https://loopin-backend-dev-env.eba-9w2ppy6p.eu-north-1.elasticbeanstalk.com/users/login-or-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.emailAddresses[0].emailAddress, is_primary: true, provider: "GOOGLE" }),
      })
        .then(res => res.json())
        .then(data => {
          setBackendToken(data.token);
          // Store the backend token in localStorage for use in other flows (e.g., Zoho callback)
          if (data.token) {
            localStorage.setItem("backendToken", data.token);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isLoaded, user]);

  return { backendToken, loading };
}
