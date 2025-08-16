import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { CalendarScreen } from "@/components/calendar-screen";

export default function CalendarPage() {
  return (
    <>
      <SignedIn>
        <CalendarScreen />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
