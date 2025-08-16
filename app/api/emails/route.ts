import { NextRequest, NextResponse } from 'next/server';
import { fetchEmailsWithOAuth2 } from '@/lib/imap';

export async function POST(req: NextRequest) {
  try {
    const { email, access_token } = await req.json();
    if (!email || !access_token) {
      return NextResponse.json({ error: 'Missing email or access_token' }, { status: 400 });
    }
    const emails = await fetchEmailsWithOAuth2(email, access_token);
    return NextResponse.json({ emails });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
