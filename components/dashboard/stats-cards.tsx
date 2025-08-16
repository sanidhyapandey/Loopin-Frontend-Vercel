"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar, Clock, AlertCircle } from "lucide-react";

interface StatsCardsProps {
  loading: boolean;
  summary: any;
  onCardClick: (type: string) => void;
}

// Loader spinner component
function MiniLoader() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin align-middle" />
  );
}

export function StatsCards({ loading, summary, onCardClick }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card onClick={() => summary && onCardClick('unread_emails')} className="cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Unread Emails</p>
              <p className="text-2xl font-bold">
                {loading ? <MiniLoader /> : summary?.unread_emails?.count ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card onClick={() => summary && onCardClick('todays_invites')} className="cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Meetings</p>
              <p className="text-2xl font-bold">
                {loading ? <MiniLoader /> : summary?.todays_invites?.count ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card onClick={() => summary && onCardClick('followups_due')} className="cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Follow-ups Due</p>
              <p className="text-2xl font-bold">
                {loading ? <MiniLoader /> : summary?.followups_due?.count ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card onClick={() => summary && onCardClick('calendar_conflicts')} className="cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Calendar Conflicts</p>
              <p className="text-2xl font-bold">
                {loading ? <MiniLoader /> : summary?.calendar_conflicts?.count ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 