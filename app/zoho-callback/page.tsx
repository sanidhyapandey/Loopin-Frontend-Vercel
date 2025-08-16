"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ZohoCallback() {
  const router = useRouter();

  useEffect(() => {
    // Extract access_token from the URL hash (after #)
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      accessToken = params.get("access_token");
    }

    // Get backend token from localStorage or sessionStorage
    let backendToken: string | null = null;
    if (typeof window !== "undefined") {
      backendToken = localStorage.getItem("backendToken") || sessionStorage.getItem("backendToken");
    }

    if (accessToken && backendToken) {
      // Store Zoho access token in sessionStorage for dashboard
      if (typeof window !== "undefined") {
        sessionStorage.setItem("zoho_access_token", accessToken);
      }
      
      // REMOVED unnecessary zoho-by-account API call - will be handled by dashboard
      // Redirect to dashboard immediately
      window.location.href = "/dashboard";
    } else {
      // Always force full reload to /dashboard
      window.location.href = "/dashboard";
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <span className="text-lg font-semibold animate-pulse">
        Connecting your Zoho account...
      </span>
    </div>
  );
}
