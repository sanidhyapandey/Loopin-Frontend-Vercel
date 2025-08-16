"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GmailTokenContextType {
  accessToken: string | null;
  refreshToken: string | null;
  connectedEmail: string | null;
  setTokens: (accessToken: string, refreshToken: string, email?: string) => void;
  clearTokens: () => void;
}

const GmailTokenContext = createContext<GmailTokenContextType | undefined>(undefined);

export const GmailTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);

  useEffect(() => {
    // On mount, load tokens from sessionStorage if present
    const storedAccess = sessionStorage.getItem("gmail_access_token");
    const storedRefresh = sessionStorage.getItem("gmail_refresh_token");
    const storedEmail = sessionStorage.getItem("gmail_connected_email");
    if (storedAccess && storedRefresh) {
      setAccessToken(JSON.parse(storedAccess));
      setRefreshToken(JSON.parse(storedRefresh));
    }
    if (storedEmail) {
      setConnectedEmail(JSON.parse(storedEmail));
    }
  }, []);

  // Debug useEffect to log state changes
  useEffect(() => {
    // State changes logged for debugging
  }, [accessToken, refreshToken, connectedEmail]);

  const setTokens = (access: string, refresh: string, email?: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    sessionStorage.setItem("gmail_access_token", JSON.stringify(access));
    sessionStorage.setItem("gmail_refresh_token", JSON.stringify(refresh));
    
    if (email) {
      setConnectedEmail(email);
      sessionStorage.setItem("gmail_connected_email", JSON.stringify(email));
    }
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setConnectedEmail(null);
    sessionStorage.removeItem("gmail_access_token");
    sessionStorage.removeItem("gmail_refresh_token");
    sessionStorage.removeItem("gmail_connected_email");
  };

  return (
    <GmailTokenContext.Provider value={{ accessToken, refreshToken, connectedEmail, setTokens, clearTokens }}>
      {children}
    </GmailTokenContext.Provider>
  );
};

export const useGmailToken = () => {
  const context = useContext(GmailTokenContext);
  if (!context) throw new Error("useGmailToken must be used within GmailTokenProvider");
  return context;
};
