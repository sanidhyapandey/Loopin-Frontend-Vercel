import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Fetch user info to get the email
    let userEmail = '';
    try {
      oauth2Client.setCredentials(tokens);
      const userinfo = await oauth2Client.request<GoogleUserInfo>({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo'
      });
      userEmail = userinfo.data.email;
    } catch (error) {
      console.error('[Google OAuth Callback] Error fetching user email:', error);
      // Try alternative endpoint
      try {
        const userinfo = await oauth2Client.request<GoogleUserInfo>({
          url: 'https://www.googleapis.com/oauth2/v1/userinfo'
        });
        userEmail = userinfo.data.email;
      } catch (v1Error) {
        console.error('[Google OAuth Callback] Error fetching user email from v1 endpoint:', v1Error);
      }
    }

    if (!userEmail) {
      console.error('[Google OAuth Callback] Failed to fetch user email');
      return new NextResponse('Failed to fetch user email', { status: 500 });
    }

    // Return a page that stores tokens and email in sessionStorage and redirects
    const html = `
      <html>
        <body>
          <script>
            sessionStorage.setItem('gmail_access_token', ${JSON.stringify(tokens.access_token)});
            sessionStorage.setItem('gmail_refresh_token', ${JSON.stringify(tokens.refresh_token)});
            sessionStorage.setItem('gmail_connected_email', ${JSON.stringify(userEmail)});
            window.location.href = '/dashboard';
          </script>
        </body>
      </html>
    `;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('[Google OAuth Callback] Error getting tokens:', error);
    return new NextResponse('OAuth error', { status: 500 });
  }
}
