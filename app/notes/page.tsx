import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { NotesScreen } from "@/components/notes-screen";

export default function NotesPage() {
  return (
    <>
      <SignedIn>
        <NotesScreen />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
