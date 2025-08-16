import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the Zoho access token from the Authorization header
    const zohoToken = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!zohoToken) {
      return NextResponse.json({ error: 'Missing Zoho token' }, { status: 401 });
    }

    // 1. Fetch calendar list to get UID
    const calendarsRes = await fetch('https://calendar.zoho.in/api/v1/calendars', {
      headers: {
        Authorization: `Bearer ${zohoToken}`,
        Accept: 'application/json',
      },
    });

    if (!calendarsRes.ok) {
      const errorBody = await calendarsRes.text();
      console.error('Calendar API error:', errorBody);
      return NextResponse.json({ error: `Zoho Calendar List error: ${calendarsRes.status} - ${errorBody}` }, { status: calendarsRes.status });
    }

    const calendarsData = await calendarsRes.json();
    
    const calendarUid = calendarsData.calendars && calendarsData.calendars[0] && calendarsData.calendars[0].uid;
    if (!calendarUid) {
      return NextResponse.json({ error: 'No Zoho calendar UID found' }, { status: 404 });
    }

    // 2. Prepare date range (last 7 days, yyyyMMdd)
    const now = new Date();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatDate = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const start = formatDate(sevenDaysAgo);
    const end = formatDate(now);
    const range = encodeURIComponent(JSON.stringify({ start, end }));

    // 3. Fetch events for the calendar UID
    const eventsUrl = `https://calendar.zoho.in/api/v1/calendars/${calendarUid}/events?range=${range}`;
    
    const eventsRes = await fetch(eventsUrl, {
      headers: {
        Authorization: `Bearer ${zohoToken}`,
        Accept: 'application/json',
      },
    });

    if (!eventsRes.ok) {
      const errorBody = await eventsRes.text();
      console.error('Events API error:', errorBody);
      return NextResponse.json({ error: `Zoho Events error: ${eventsRes.status} - ${errorBody}` }, { status: eventsRes.status });
    }

    const eventsData = await eventsRes.json();
    
    return NextResponse.json(eventsData, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in Zoho events API:', error);
    return NextResponse.json({ error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
} 