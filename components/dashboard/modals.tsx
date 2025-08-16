"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface ModalsProps {
  modalOpen: string | null;
  setModalOpen: (modal: string | null) => void;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;
  summary: any;
}

// Map modal types to summary keys for new snake_case API
const modalDataMap: Record<string, string> = {
  unread_emails: "unread_emails",
  todays_invites: "todays_invites",
  followups_due: "followups_due",
  calendar_conflicts: "calendar_conflicts"
};

// Update ModalContent for new structure
function ModalContent({ type, data }: { type: string, data: any[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500">No data found.</div>;
  
  if (type === 'unread_emails' || type === 'todays_invites') {
    return (
      <ul className="space-y-3">
        {data.map((item, idx) => (
          <li key={item.id || idx} className="border-b pb-2">
            <div className="font-semibold">{item.subject}</div>
            <div className="text-xs text-gray-500">From: {item.from}</div>
            <div className="text-xs text-gray-400">{item.date}</div>
            <div className="text-sm mt-1">{item.snippet}</div>
          </li>
        ))}
      </ul>
    );
  }
  
  if (type === 'followups_due') {
    return <div className="text-gray-500">No follow-ups due!</div>;
  }
  
  if (type === 'calendar_conflicts') {
    // Fallback: handle array of objects with 'conflict', or array of strings, or a single string
    if (Array.isArray(data)) {
      // If the first item is an object with 'conflict', render as note
      if (data[0] && typeof data[0] === 'object' && 'conflict' in data[0]) {
        return (
          <ul className="space-y-3">
            {data.map((conflict, idx) => (
              <li key={idx} className="border-b pb-2">
                <div className="font-semibold mb-1">{conflict.conflict}</div>
              </li>
            ))}
          </ul>
        );
      }
      // If array of strings
      if (typeof data[0] === 'string') {
        return (
          <ul className="space-y-3">
            {data.map((conflict, idx) => (
              <li key={idx} className="border-b pb-2">
                <div className="font-semibold mb-1">{conflict}</div>
              </li>
            ))}
          </ul>
        );
      }
    }
    // If data is a single string
    if (typeof data === 'string') {
      return <div className="font-semibold mb-1">{data}</div>;
    }
    return <div className="text-gray-500">No conflict details available.</div>;
  }
  
  return <div className="text-gray-500">No details available.</div>;
}

export function Modals({ modalOpen, setModalOpen, connectModalOpen, setConnectModalOpen, summary }: ModalsProps) {
  return (
    <>
      {/* Modal for details */}
      <Dialog open={!!modalOpen} onOpenChange={() => setModalOpen(null)}>
        <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {modalOpen === 'unread_emails' && 'Unread Emails'}
            {modalOpen === 'todays_invites' && "Today's Meetings"}
            {modalOpen === 'followups_due' && 'Follow-ups Due'}
            {modalOpen === 'calendar_conflicts' && 'Calendar Conflicts'}
          </h2>
          <div className="max-h-96 overflow-y-auto">
            {modalOpen && (
              <ModalContent
                type={modalOpen}
                data={summary?.[modalDataMap[modalOpen]]?.data}
              />
            )}
          </div>
          <Button className="mt-4" onClick={() => setModalOpen(null)}>Close</Button>
        </div>
      </Dialog>

      {/* Connect Account Modal */}
      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <div className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Connect Email Account</h2>
          <Button
            variant="outline"
            className="w-full mb-3"
            onClick={() => {
              setConnectModalOpen(false);
              window.location.href = '/api/auth/google/start';
            }}
          >
            Connect Gmail (OAuth)
          </Button>
          <Button
            variant="outline"
            className="w-full mb-3"
            onClick={() => {
              setConnectModalOpen(false);
              window.location.href = '/api/auth/zoho/start';
            }}
          >
            Connect Zoho Mail (OAuth)
          </Button>
          <Button
            variant="outline"
            className="w-full mb-3"
            onClick={() => {
              setConnectModalOpen(false);
              window.location.href = '/api/auth/outlook/start';
            }}
          >
            Connect Outlook (OAuth)
          </Button>
          <Button
            variant="outline"
            className="w-full mb-3"
            onClick={() => {
              setConnectModalOpen(false);
              window.location.href = '/api/auth/yahoo/start';
            }}
          >
            Connect Yahoo Mail (OAuth)
          </Button>
          <Button className="mt-6 w-full" onClick={() => setConnectModalOpen(false)}>
            Close
          </Button>
        </div>
      </Dialog>
    </>
  );
} 