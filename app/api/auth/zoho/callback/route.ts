import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return new NextResponse("Missing code from Zoho OAuth", { status: 400 });
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const redirectUri = process.env.ZOHO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse("Missing Zoho OAuth env vars", { status: 500 });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('[Zoho OAuth Callback] Failed to get access token:', tokenData);
      return new NextResponse("Failed to get Zoho access token", { status: 500 });
    }

    // Use hardcoded email for now
    const accountRes = await fetch("https://mail.zoho.com/api/accounts", {
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
      },
    });
    
    const accountData = await accountRes.json();
    
    if (!accountData.data || !Array.isArray(accountData.data) || accountData.data.length === 0) {
      console.error('[Zoho Accounts API] No accounts found');
      return new NextResponse("No Zoho mail accounts found", { status: 500 });
    }
    
    // 2. Use the first account
    const account = accountData.data[0];
    const userEmail = account.emailAddress;

    // Return a page that stores tokens and email in sessionStorage and redirects
    const html = `
      <html>
        <body>
          <script>
            const accessToken = ${JSON.stringify(tokenData.access_token)};
            const userEmail = ${JSON.stringify(userEmail)};
            
            // Store in sessionStorage
            sessionStorage.setItem('zoho_access_token', accessToken);
            sessionStorage.setItem('zoho_connected_email', userEmail);
            
            window.location.href = '/dashboard';
          </script>
        </body>
      </html>
    `;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('[Zoho OAuth Callback] Error:', error);
    return new NextResponse('OAuth error', { status: 500 });
  }
}
