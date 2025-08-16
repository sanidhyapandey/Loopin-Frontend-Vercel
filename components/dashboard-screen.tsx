"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { useState } from "react"
import { ChatbotWidget } from "./chatbot-widget"
import { useUserEmail } from "@/lib/getUserEmail"
import { GmailTokenProvider } from "@/lib/gmail-token-context"
import { useUserName } from "@/lib/getUserName"

// Import new components
import { Sidebar } from "./dashboard/sidebar"
import { Header } from "./dashboard/header"
import { StatsCards } from "./dashboard/stats-cards"
import { MeetingContext } from "./dashboard/meeting-context"
import { ChartsSection } from "./dashboard/charts-section"
import { Modals } from "./dashboard/modals"
import { useDashboardData } from "./dashboard/use-dashboard-data"
import { ConnectedAccountsModal } from "./dashboard/connected-accounts-modal"

export function DashboardScreen() {
  const userEmail = useUserEmail();
  const userName = useUserName();
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectedAccountsModalOpen, setConnectedAccountsModalOpen] = useState(false);

  // Use the custom hook for data management
  const { loading, summary, emails, nextMeetingInvite, backendToken, getConnectedAccounts } = useDashboardData();

  // Block dashboard until backend token is ready
  if (loading || !backendToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar userName={userName} userEmail={userEmail} />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top navigation */}
            <Header 
              loading={loading} 
              onConnectAccount={() => setConnectModalOpen(true)}
              onShowConnectedAccounts={() => setConnectedAccountsModalOpen(true)}
            />

            {/* Dashboard content */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Good morning, {userName.split(" ")[0]}</h1>
                <p className="text-gray-600">Here&apos;s what&apos;s happening today</p>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="emails">Emails</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Quick stats */}
                  <StatsCards 
                    loading={loading}
                    summary={summary}
                    onCardClick={setModalOpen}
                  />

                  {/* Next meeting context */}
                  <MeetingContext 
                    loading={loading}
                    summary={summary}
                    nextMeetingInvite={nextMeetingInvite}
                  />

                  {/* Contact graph and activity */}
                  <ChartsSection />
                </TabsContent>
              </Tabs>

              {/* Emails section */}
              <div className="mt-8">
                {loading && <p>Loading emails...</p>}
                {emails.length > 0 && (
                  <ul>
                    {emails.map((email, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        <strong>{email.subject}</strong> from {email.from}
                        <div>{email.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Modals */}
              <Modals 
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                connectModalOpen={connectModalOpen}
                setConnectModalOpen={setConnectModalOpen}
                summary={summary}
              />

              {/* Connected Accounts Modal */}
              <ConnectedAccountsModal
                isOpen={connectedAccountsModalOpen}
                onClose={() => setConnectedAccountsModalOpen(false)}
                connectedAccounts={getConnectedAccounts()}
              />
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <ChatbotWidget backendToken={backendToken} userEmail={userEmail} />
    </>
  )
}

// Wrap the export with GmailTokenProvider
export default function DashboardScreenWithProvider(props: any) {
  return (
    <GmailTokenProvider>
      <DashboardScreen {...props} />
    </GmailTokenProvider>
  );
}