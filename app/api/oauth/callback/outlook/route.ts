import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.OUTLOOK_CLIENT_ID!;
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET!;
  const redirectUri = process.env.OUTLOOK_REDIRECT_URI!;
  const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code");
  params.append("scope", [
    "openid",
    "profile",
    "offline_access",
    "email",
    "https://graph.microsoft.com/Mail.Read",
    "https://graph.microsoft.com/User.Read",
    "https://graph.microsoft.com/Calendars.ReadWrite",
  ].join(" "));

  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();

  // Fetch user's email using the access token
  let userEmail = '';
  if (tokenData.access_token) {
    try {
      const userInfoRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        userEmail = userInfo.mail || userInfo.userPrincipalName;
      } else {
        console.error("[Outlook OAuth] Failed to fetch user info:", userInfoRes.status);
        userEmail = 'outlook-user@outlook.com'; // generic fallback
      }
    } catch (error) {
      console.error("[Outlook OAuth] Error fetching user info:", error);
      userEmail = 'outlook-user@outlook.com'; // generic fallback
    }
  }

  // Set access token and real email in sessionStorage, then redirect to dashboard
  if (tokenData.access_token) {
    return new Response(`
      <script>
        sessionStorage.setItem('outlook_access_token', ${JSON.stringify(tokenData.access_token)});
        sessionStorage.setItem('outlook_connected_email', ${JSON.stringify(userEmail)});
        window.location.href = '/dashboard';
      </script>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  return NextResponse.json(tokenData);
}
