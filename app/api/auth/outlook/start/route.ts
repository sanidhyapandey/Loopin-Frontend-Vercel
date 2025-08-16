import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // You may want to load these from process.env in a real app
  const clientId = process.env.OUTLOOK_CLIENT_ID!;
  const redirectUri = process.env.OUTLOOK_REDIRECT_URI!;
  const scope = [
    "openid",
    "profile",
    "offline_access",
    "email",
    "https://graph.microsoft.com/Mail.Read",
    "https://graph.microsoft.com/User.Read",
    "https://graph.microsoft.com/Calendars.ReadWrite",
  ].join(" ");
  const responseType = "code";
  const state = Math.random().toString(36).substring(2, 15); // simple random state
  const authUrl =
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&response_type=${encodeURIComponent(responseType)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(authUrl);
}
