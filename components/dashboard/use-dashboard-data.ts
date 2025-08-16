import { useState, useEffect, useMemo } from "react";
import { useBackendAuth } from "@/lib/useBackendAuth";
import { useGmailToken } from "@/lib/gmail-token-context";

export function useDashboardData() {
  const { backendToken, loading: backendLoading } = useBackendAuth();
  const { accessToken, refreshToken, connectedEmail, setTokens } = useGmailToken();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  // Find next meeting invite from emails
  const nextMeetingInvite = useMemo(() => {
    return emails.find(email =>
      (email.subject && email.subject.toLowerCase().includes('invitation')) ||
      (email.text && email.text.toLowerCase().includes('join with google meet'))
    );
  }, [emails]);

  // Safe JSON parsing function
  const safeJsonParse = (value: string | null, defaultValue: any = null) => {
    if (!value) return defaultValue;
    
    // If the value doesn't look like JSON, return it as-is
    if (!value.startsWith('"') && !value.startsWith('{') && !value.startsWith('[')) {
      return value;
    }
    
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('[safeJsonParse] Error parsing JSON:', error, 'Value:', value);
      return defaultValue;
    }
  };



  // On mount, move tokens from sessionStorage to context if present
  useEffect(() => {
    // Gmail: check for access token in sessionStorage (set by gmail-callback)
    const gmail_access_token_raw = sessionStorage.getItem('gmail_access_token');
    const gmail_access_token = gmail_access_token_raw
      ? (gmail_access_token_raw.startsWith('"') ? safeJsonParse(gmail_access_token_raw) : gmail_access_token_raw)
      : null;

    const gmail_refresh_token_raw = sessionStorage.getItem('gmail_refresh_token');
    const gmail_refresh_token = gmail_refresh_token_raw
      ? (gmail_refresh_token_raw.startsWith('"') ? safeJsonParse(gmail_refresh_token_raw) : gmail_refresh_token_raw)
      : null;

    const gmail_connected_email_raw = sessionStorage.getItem('gmail_connected_email');
    const gmail_connected_email = gmail_connected_email_raw
      ? (gmail_connected_email_raw.startsWith('"') ? safeJsonParse(gmail_connected_email_raw) : gmail_connected_email_raw)
      : null;
    
    if (gmail_access_token && gmail_refresh_token) {
      setTokens(gmail_access_token, gmail_refresh_token, gmail_connected_email);
      sessionStorage.removeItem('gmail_access_token');
      sessionStorage.removeItem('gmail_refresh_token');
      // Don't remove the connected email - preserve it for account info
      // sessionStorage.removeItem('gmail_connected_email');
    }

    // Zoho: check for access token in sessionStorage (set by zoho-callback)
    const zoho_access_token_raw = sessionStorage.getItem('zoho_access_token');
    const zoho_access_token = zoho_access_token_raw ? 
      (zoho_access_token_raw.startsWith('"') ? safeJsonParse(zoho_access_token_raw) : zoho_access_token_raw) : 
      null;
    const zoho_connected_email_raw = sessionStorage.getItem('zoho_connected_email');
    const zoho_connected_email = zoho_connected_email_raw
      ? (zoho_connected_email_raw.startsWith('"') ? safeJsonParse(zoho_connected_email_raw) : zoho_connected_email_raw)
      : null;
    
    if (zoho_access_token && backendToken) {
      setLoading(true);
      
      const connectRequestBody = {
        email: 'sanidhya-test@zohomail.in', // Hardcoded email
        provider: 'ZOHO',
        access_token: zoho_access_token,
        refresh_token: '', // Zoho doesn't provide refresh token in this flow
        is_primary: false,
      };
      
      fetch('https://loopin-backend-dev-env.eba-9w2ppy6p.eu-north-1.elasticbeanstalk.com/users/connect-email-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${backendToken}`,
        },
        body: JSON.stringify(connectRequestBody),
      })
      .then(res => res.json())
      .then(data => {
        // REMOVED unnecessary zoho-by-account call - summary will be fetched by unified-summary API
        return Promise.resolve({}); // Return empty object to continue the promise chain
      })
      .then(data => {
        // Zoho flow completed
      })
      .catch((err) => {
        console.error('[Zoho useEffect] Zoho API error', err);
      })
      .finally(() => {
        setLoading(false);
      });
      
      // Don't remove Zoho tokens from sessionStorage - preserve them for account info
      // sessionStorage.removeItem('zoho_access_token');
      // sessionStorage.removeItem('zoho_connected_email');
    }
  }, [backendToken, setTokens]);

  // Unified summary API call after connecting any account
  useEffect(() => {
    if (backendToken) {
      setLoading(true);
      fetch('https://loopin-backend-dev-env.eba-9w2ppy6p.eu-north-1.elasticbeanstalk.com/email/rag/unified-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${backendToken}`,
        },
        body: JSON.stringify({}),
      })
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setEmails(data.unread_emails?.data || []);
      })
      .catch(err => {
        console.error('[Unified Summary] API error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [backendToken]);

  // Connect Gmail account if tokens are present in context
  useEffect(() => {
    async function connectAndFetchSummary() {
      if (
        accessToken &&
        refreshToken &&
        backendToken &&
        connectedEmail
      ) {
        try {
          await fetch('https://loopin-backend-dev-env.eba-9w2ppy6p.eu-north-1.elasticbeanstalk.com/users/connect-email-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${backendToken}`,
            },
            body: JSON.stringify({
              email: connectedEmail,
              provider: 'GOOGLE',
              access_token: accessToken,
              refresh_token: refreshToken,
              is_primary: false,
            }),
          });

          // REMOVED unnecessary important-unread-summary call - summary will be fetched by unified-summary API
          // Summary will be fetched by the unified-summary useEffect
        } catch (err) {
          console.error('Error in connectAndFetchSummary:', err);
          setSummary(null);
        } finally {
          setLoading(false);
        }
      }
    }
    connectAndFetchSummary();
  }, [accessToken, refreshToken, backendToken, connectedEmail]);

  // Outlook: check for access token in sessionStorage (set by outlook-callback)
  useEffect(() => {
    const outlook_access_token_raw = sessionStorage.getItem('outlook_access_token');
    const outlook_access_token = outlook_access_token_raw
      ? (outlook_access_token_raw.startsWith('"') ? JSON.parse(outlook_access_token_raw) : outlook_access_token_raw)
      : null;
    const outlook_connected_email_raw = sessionStorage.getItem('outlook_connected_email');
    const outlook_connected_email = outlook_connected_email_raw
      ? (outlook_connected_email_raw.startsWith('"') ? JSON.parse(outlook_connected_email_raw) : outlook_connected_email_raw)
      : null;

    if (outlook_access_token && outlook_connected_email && backendToken) {
      fetch('https://loopin-backend-dev-env.eba-9w2ppy6p.eu-north-1.elasticbeanstalk.com/users/connect-email-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${backendToken}`,
        },
        body: JSON.stringify({
          email: outlook_connected_email,
          provider: 'OUTLOOK',
          access_token: outlook_access_token,
          refresh_token: '',
          is_primary: false,
        }),
      })
      .then(res => res.json())
      .then(data => {
        // Optionally handle response
      })
      .catch(err => {
        console.error('[Outlook useEffect] Error connecting Outlook account:', err);
      })
      .finally(() => {
        // Don't remove Outlook tokens from sessionStorage - they're needed for calendar API calls
        // sessionStorage.removeItem('outlook_access_token');
        // sessionStorage.removeItem('outlook_connected_email');
      });
    }
  }, [backendToken]);

  // Store Gmail accessToken in sessionStorage for use in other pages (e.g., calendar)
  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("gmail_access_token", JSON.stringify(accessToken));
    }
  }, [accessToken]);

  // Function to get connected accounts information
  const getConnectedAccounts = () => {
    const accounts = [];
    
    // Helper function to safely parse email values
    const safeParseEmail = (emailValue: string | null): string | null => {
      if (!emailValue) return null;
      
      // If it starts with a quote, it's likely JSON
      if (emailValue.startsWith('"')) {
        try {
          const parsed = JSON.parse(emailValue);
          return parsed;
        } catch (e) {
          console.error('Error parsing JSON email:', e, 'Value:', emailValue);
          return null;
        }
      }
      
      // Otherwise, treat it as a plain string
      return emailValue;
    };
    
    // Check Gmail
    const gmailEmail = safeParseEmail(sessionStorage.getItem('gmail_connected_email'));
    if (gmailEmail) {
      accounts.push({
        provider: 'GOOGLE' as const,
        email: gmailEmail,
        status: 'connected' as const,
        lastConnected: new Date().toLocaleDateString()
      });
    }
    
    // Check Zoho
    const zohoEmail = safeParseEmail(sessionStorage.getItem('zoho_connected_email'));
    if (zohoEmail) {
      accounts.push({
        provider: 'ZOHO' as const,
        email: zohoEmail,
        status: 'connected' as const,
        lastConnected: new Date().toLocaleDateString()
      });
    }
    
    // Check Outlook
    const outlookEmail = safeParseEmail(sessionStorage.getItem('outlook_connected_email'));
    if (outlookEmail) {
      accounts.push({
        provider: 'OUTLOOK' as const,
        email: outlookEmail,
        status: 'connected' as const,
        lastConnected: new Date().toLocaleDateString()
      });
    }
    
    return accounts;
  };

  return {
    loading: backendLoading || loading,
    summary,
    emails,
    nextMeetingInvite,
    backendToken,
    getConnectedAccounts
  };
} 