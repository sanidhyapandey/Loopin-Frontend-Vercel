import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const redirectUri = process.env.YAHOO_REDIRECT_URI;
  const scope = "mail-r openid email"; // Yahoo Mail read-only scope
  const state = Math.random().toString(36).substring(2);

  if (!clientId || !redirectUri) {
    return new NextResponse("Missing Yahoo client ID or redirect URI", { status: 500 });
  }

  const url = `https://api.login.yahoo.com/oauth2/request_auth?response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${state}`;

  return NextResponse.redirect(url);
}
