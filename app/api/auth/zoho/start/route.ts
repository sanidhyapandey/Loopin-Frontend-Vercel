import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const redirectUri = process.env.ZOHO_REDIRECT_URI;
  const scope = "ZohoMail.messages.READ,ZohoMail.accounts.READ,ZohoCalendar.calendar.ALL,ZohoCalendar.event.ALL"; // Removed users.READ scope
  const state = Math.random().toString(36).substring(2); // random state for CSRF protection



  if (!clientId || !redirectUri) {
    console.error("[ZOHO OAUTH] Missing clientId or redirectUri");
    return new NextResponse("Missing Zoho client ID or redirect URI", { status: 500 });
  }

  const url = `https://accounts.zoho.com/oauth/v2/auth?response_type=token&client_id=${clientId}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&access_type=offline&prompt=consent&state=${state}`;



  return NextResponse.redirect(url);
}
