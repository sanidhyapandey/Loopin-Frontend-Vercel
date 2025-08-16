import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { MeetingContextScreen } from "@/components/meeting-context-screen";

export default function MeetingContextPage() {
  return (
    <>
      <SignedIn>
        <MeetingContextScreen />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
