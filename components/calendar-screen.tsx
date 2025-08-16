"use client";

import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: Array<{ email: string; responseStatus: string }>;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: any;
  source: 'google' | 'zoho' | 'outlook';
  organizer?: string;
  description?: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: string;
  attendees?: Array<{ email: string; responseStatus: string }>;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: any;
  organizer?: { email: string };
  description?: string;
}

interface ZohoCalendarEvent {
  uid: string;
  title: string;
  dateandtime: {
    start: string;
    end: string;
    timezone: string;
  };
  location?: string;
  attendees?: Array<{ email: string; status: string }>;
  viewEventURL?: string;
  organizer?: string;
  orgDName?: string;
}

interface OutlookCalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName?: string;
  };
  attendees?: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
    status: {
      response: string;
    };
  }>;
  webLink?: string;
  organizer?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  onlineMeeting?: {
    joinUrl?: string;
  };
  body?: {
    content?: string;
  };
}

interface UnifiedCalendarData {
  google?: {
    items: GoogleCalendarEvent[];
  };
  zoho?: {
    events?: ZohoCalendarEvent[];
  };
  outlook?: {
    value?: OutlookCalendarEvent[];
  };
}

export function CalendarScreen() {
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [zohoToken, setZohoToken] = useState<string | null>(null);
  const [outlookToken, setOutlookToken] = useState<string | null>(null);
  const [data, setData] = useState<UnifiedCalendarData>({});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>({});
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    // Read tokens from sessionStorage (set after OAuth callback)
    const gToken = sessionStorage.getItem("gmail_access_token");
    let parsedGToken = null;
    if (gToken) {
      try {
        parsedGToken = JSON.parse(gToken);
      } catch {
        parsedGToken = gToken;
      }
    }
    setGoogleToken(parsedGToken);

    const zToken = sessionStorage.getItem("zoho_access_token");
    let parsedZToken = null;
    if (zToken) {
      try {
        parsedZToken = JSON.parse(zToken);
      } catch {
        parsedZToken = zToken;
      }
    }
    setZohoToken(parsedZToken);

    const oToken = sessionStorage.getItem("outlook_access_token");
    let parsedOToken = null;
    if (oToken) {
      try {
        parsedOToken = JSON.parse(oToken);
      } catch {
        parsedOToken = oToken;
      }
    }
    setOutlookToken(parsedOToken);
  }, []);

  useEffect(() => {
    async function fetchCalendars() {
      setLoading(true);
      setError({});
      const results: UnifiedCalendarData = {};
      const errors: any = {};
      
      // Google Calendar
      if (googleToken) {
        try {
          const res = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&singleEvents=true&orderBy=startTime&timeMin=" +
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            {
              headers: { Authorization: `Bearer ${googleToken}` },
            }
          );
          if (!res.ok) throw new Error(`Google API error: ${res.status}`);
          results.google = await res.json();
        } catch (e: any) {
          errors.google = e.message || "Unknown error";
        }
      }
      
      // Zoho Calendar
      if (zohoToken) {
        try {
          // Call the Next.js API route to get Zoho events
          const eventsRes = await fetch("/api/zoho/events", {
            headers: {
              Authorization: `Bearer ${zohoToken}`,
            },
          });
          if (!eventsRes.ok) {
            const errorBody = await eventsRes.text();
            throw new Error(`Zoho API error: ${eventsRes.status} - ${errorBody}`);
          }
          results.zoho = await eventsRes.json();
        } catch (e: any) {
          errors.zoho = e.message || "Unknown error";
        }
      }

      // Outlook Calendar
      if (outlookToken) {
        try {
          // Call the Next.js API route to get Outlook events
          const eventsRes = await fetch("/api/outlook/events", {
            headers: {
              Authorization: `Bearer ${outlookToken}`,
            },
          });
          if (!eventsRes.ok) {
            const errorBody = await eventsRes.text();
            throw new Error(`Outlook API error: ${eventsRes.status} - ${errorBody}`);
          }
          results.outlook = await eventsRes.json();
        } catch (e: any) {
          errors.outlook = e.message || "Unknown error";
        }
      }
      
      setData(results);
      setError(errors);
      setLoading(false);
    }
    
    if (googleToken || zohoToken || outlookToken) {
      fetchCalendars();
    }
  }, [googleToken, zohoToken, outlookToken]);

  // Transform data to react-big-calendar format
  useEffect(() => {
    const transformedEvents: CalendarEvent[] = [];

    // Transform Google Calendar events
    if (data.google?.items) {
      data.google.items.forEach((event) => {
        transformedEvents.push({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
          location: event.location,
          attendees: event.attendees,
          htmlLink: event.htmlLink,
          hangoutLink: event.hangoutLink,
          conferenceData: event.conferenceData,
          source: 'google' as const,
          organizer: event.organizer?.email,
          description: event.description,
        });
      });
    }

    // Transform Zoho Calendar events
    if (data.zoho?.events) {
      data.zoho.events.forEach((event) => {
        // Parse Zoho date format (YYYYMMDDTHHMMSS+HHMM)
        const parseZohoDate = (dateStr: string) => {
          // Format: "20250726T150000+0530"
          const year = parseInt(dateStr.substring(0, 4));
          const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
          const day = parseInt(dateStr.substring(6, 8));
          const hour = parseInt(dateStr.substring(9, 11));
          const minute = parseInt(dateStr.substring(11, 13));
          const second = parseInt(dateStr.substring(13, 15));
          
          return new Date(year, month, day, hour, minute, second);
        };

        transformedEvents.push({
          id: event.uid,
          title: event.title,
          start: parseZohoDate(event.dateandtime.start),
          end: parseZohoDate(event.dateandtime.end),
          location: event.location,
          attendees: event.attendees?.map(att => ({
            email: att.email,
            responseStatus: att.status
          })),
          htmlLink: event.viewEventURL,
          source: 'zoho' as const,
          organizer: event.organizer,
          description: event.orgDName,
        });
      });
    }

    // Transform Outlook Calendar events
    if (data.outlook?.value) {
      data.outlook.value.forEach((event) => {
        transformedEvents.push({
          id: event.id,
          title: event.subject,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
          location: event.location?.displayName,
          attendees: event.attendees?.map(att => ({
            email: att.emailAddress.address,
            responseStatus: att.status.response
          })),
          htmlLink: event.webLink,
          hangoutLink: event.onlineMeeting?.joinUrl,
          source: 'outlook' as const,
          organizer: event.organizer?.emailAddress?.address,
          description: event.body?.content,
        });
      });
    }

    setEvents(transformedEvents);
  }, [data]);

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const getMeetingLink = () => {
      return event.hangoutLink || event.htmlLink || event.location || undefined;
    };

    return (
      <div className="p-1 h-full flex flex-col justify-between" data-source={event.source}>
        <div className="font-semibold text-sm leading-tight mb-1">{event.title}</div>
        {event.location && (
          <div className="mb-1">
            <a className="text-xs underline break-all" href={event.location} target="_blank" rel="noopener noreferrer">{event.location}</a>
          </div>
        )}
        {getMeetingLink() && (
          <a
            href={getMeetingLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline break-all mb-1"
            onClick={(e) => e.stopPropagation()}
          >
            Join Meeting
          </a>
        )}
        <div className={`text-xs px-1 py-0.5 rounded mt-auto w-fit ${
          event.source === 'google' ? 'bg-green-100 text-green-800' : 
          event.source === 'zoho' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {event.source === 'google' ? 'Google' : 
           event.source === 'zoho' ? 'Zoho' : 'Outlook'}
        </div>
      </div>
    );
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar: any) => {
    const goToToday = () => {
      setCurrentDate(new Date());
    };

    const goToPrevious = () => {
      if (currentView === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      } else if (currentView === 'week') {
        setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
      } else if (currentView === 'day') {
        setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
      }
    };

    const goToNext = () => {
      if (currentView === 'month') {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      } else if (currentView === 'week') {
        setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
      } else if (currentView === 'day') {
        setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
      }
    };

    const viewNames = {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      agenda: 'Agenda',
    };

    const viewIcons = {
      month: '📅',
      week: '📆',
      day: '📋',
      agenda: '📝',
    };

    return (
      <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
          >
            Next →
          </button>
        </div>
        
        <div className="text-lg font-semibold text-gray-800">
          {toolbar.label}
        </div>
        
        <div className="flex items-center space-x-2">
          {toolbar.views.map((view: string) => (
            <button
              key={view}
              onClick={() => {
                if (view === 'month' || view === 'week' || view === 'day' || view === 'agenda') {
                  setCurrentView(view as 'month' | 'week' | 'day' | 'agenda');
                }
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentView === view
                  ? 'text-white bg-blue-600 border border-blue-600 shadow-md transform scale-105'
                  : 'text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <span className="mr-2">{viewIcons[view as keyof typeof viewIcons]}</span>
              {viewNames[view as keyof typeof viewNames] || view}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Unified Calendar</h2>
        <p className="text-gray-600">View all your Google and Zoho calendar events in one place</p>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading calendar events...</span>
        </div>
      )}
      
      {error.google && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="text-red-600 font-medium">Google Calendar Error:</div>
            <div className="text-red-500 ml-2">{error.google}</div>
          </div>
        </div>
      )}
      
      {error.zoho && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="text-red-600 font-medium">Zoho Calendar Error:</div>
            <div className="text-red-500 ml-2">{error.zoho}</div>
          </div>
        </div>
      )}

      {error.outlook && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="text-red-600 font-medium">Outlook Calendar Error:</div>
            <div className="text-red-500 ml-2">{error.outlook}</div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-800 font-semibold">Total Events</div>
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-semibold">Google Events</div>
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.source === 'google').length}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-purple-800 font-semibold">Zoho Events</div>
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.source === 'zoho').length}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-orange-800 font-semibold">Outlook Events</div>
              <div className="text-2xl font-bold text-orange-600">
                {data.outlook?.value?.length || 0}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <style jsx>{`
              .rbc-calendar {
                height: 600px !important;
              }
              .rbc-month-view {
                height: 100% !important;
              }
              .rbc-time-view {
                height: 100% !important;
              }
              .rbc-event {
                height: 100% !important;
                min-height: 20px !important;
                overflow: visible !important;
              }
              .rbc-event-content {
                height: 100% !important;
                overflow: visible !important;
              }
              .rbc-time-content {
                height: 100% !important;
              }
              .rbc-timeslot-group {
                min-height: 30px !important;
              }
            `}</style>
            <Calendar
              key={`${currentView}-${currentDate.getTime()}`}
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              components={{
                event: EventComponent,
                toolbar: CustomToolbar,
              }}
              views={['month', 'week', 'day', 'agenda']}
              view={currentView}
              date={currentDate}
              onView={(newView) => {
                if (newView === 'month' || newView === 'week' || newView === 'day' || newView === 'agenda') {
                  setCurrentView(newView);
                }
              }}
              onNavigate={(newDate) => setCurrentDate(newDate)}
              selectable
              popup
              step={30}
              timeslots={2}
              min={new Date(0, 0, 0, 0, 0, 0)}
              max={new Date(0, 0, 0, 23, 59, 59)}
              showMultiDayTimes={true}
              dayLayoutAlgorithm="no-overlap"
              onSelectEvent={(event) => {
                // You can add a modal here to show event details
              }}
            />
          </div>

          {/* Raw Data Toggle */}
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
              View Raw API Data
            </summary>
            <pre className="mt-4 bg-gray-100 p-4 rounded text-xs overflow-x-auto">
              {Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : "No data"}
            </pre>
          </details>

          {/* Outlook Raw Data */}
          {data.outlook && (
            <details className="bg-orange-50 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-orange-700 hover:text-orange-900">
                View Outlook Raw Data
              </summary>
              <pre className="mt-4 bg-orange-100 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(data.outlook, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
