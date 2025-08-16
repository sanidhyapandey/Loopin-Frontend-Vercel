import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return new NextResponse("Missing code from Yahoo OAuth", { status: 400 });
  }

  const clientId = process.env.YAHOO_CLIENT_ID;
  const clientSecret = process.env.YAHOO_CLIENT_SECRET;
  const redirectUri = process.env.YAHOO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse("Missing Yahoo OAuth env vars", { status: 500 });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new NextResponse("Failed to get Yahoo access token", { status: 500 });
  }

  // Pass tokens to dashboard via query params (or store in session/cookie as needed)
  const params = new URLSearchParams({
    yahoo_access_token: tokenData.access_token,
    yahoo_refresh_token: tokenData.refresh_token || "",
    expires_in: String(tokenData.expires_in || "")
  });
  return NextResponse.redirect(`/dashboard?${params.toString()}`);
}
