import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No valid authorization header" }, { status: 401 });
  }

  const accessToken = authHeader.substring(7);

  try {
    // Get events from the last 7 days to next 30 days
    const now = new Date();
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const url = `https://graph.microsoft.com/v1.0/me/events?$select=id,subject,start,end,location,attendees,organizer,body,onlineMeeting,webLink&$filter=start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'&$orderby=start/dateTime&$top=50`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Outlook API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Outlook API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Outlook events:", error);
    return NextResponse.json(
      { error: "Failed to fetch Outlook events", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 