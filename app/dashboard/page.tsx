import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import DashboardScreen, { DashboardScreen as DashboardScreenComponent } from "../../components/dashboard-screen";
import { GmailTokenProvider } from "@/lib/gmail-token-context";

export default function AppWithGmailTokenProvider(props: any) {
  return (
    <GmailTokenProvider>
      <SignedIn>
        <DashboardScreenComponent {...props} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </GmailTokenProvider>
  );
}
