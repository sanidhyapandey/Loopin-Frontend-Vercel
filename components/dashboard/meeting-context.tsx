"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MeetingContextProps {
  loading: boolean;
  summary: any;
  nextMeetingInvite: any;
}

// Loader spinner component
function MiniLoader() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin align-middle" />
  );
}

export function MeetingContext({ loading, summary, nextMeetingInvite }: MeetingContextProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Meeting Context</CardTitle>
        {loading ? (
          <div className="h-6 flex items-center"><MiniLoader /></div>
        ) : summary?.next_meeting_context ? (
          <CardDescription>
            Next: {typeof summary.next_meeting_context === 'string' 
              ? summary.next_meeting_context 
              : summary.next_meeting_context.context}
          </CardDescription>
        ) : nextMeetingInvite ? (
          <CardDescription>{nextMeetingInvite.subject}</CardDescription>
        ) : (
          <CardDescription>No upcoming meeting invite found.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-12 flex items-center justify-center"><MiniLoader /></div>
        ) : summary?.next_meeting_context ? (
          <div className="space-y-4">
            <div className="rounded-md bg-gray-50 p-3 text-sm">
              {typeof summary.next_meeting_context === 'string' 
                ? summary.next_meeting_context 
                : summary.next_meeting_context.context}
            </div>
          </div>
        ) : nextMeetingInvite ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">From: {nextMeetingInvite.from}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Invite Details</h4>
              <div className="rounded-md bg-gray-50 p-3 text-sm">
                <p>{nextMeetingInvite.text?.split('\n').slice(0, 8).join(' ')}</p>
                {nextMeetingInvite.text?.includes('https://meet.google.com') && (
                  <p className="mt-2">
                    <a 
                      href={nextMeetingInvite.text.match(/https:\/\/meet\.google\.com\/[\w-]+/)?.[0] || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 underline"
                    >
                      Join Google Meet
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No meeting invite details available.</div>
        )}
      </CardContent>
    </Card>
  );
} 